import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import {CdkpipelinesDemoStage} from "./cdkpipelines-demo-stage";
import {ShellScriptAction} from "@aws-cdk/pipelines";

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const sourceArtifact = new codepipeline.Artifact();
        const cloudAssemblyArtifact = new codepipeline.Artifact();

        const pipeline = new CdkPipeline(this, 'Pipeline', {
            // The pipeline name
            pipelineName: 'MyServicePipeline',
            cloudAssemblyArtifact,

            // Where the source can be found
            sourceAction: new codepipeline_actions.GitHubSourceAction({
                actionName: 'GitHub',
                output: sourceArtifact,
                oauthToken: SecretValue.secretsManager('github-pretty'),
                owner: 'PrettySolution',
                repo: 'cdkpipelines-demo',
            }),

            // How it will be built and synthesized
            synthAction: SimpleSynthAction.standardNpmSynth({
                sourceArtifact,
                cloudAssemblyArtifact,

                // We need a build step to compile the TypeScript Lambda
                buildCommand: 'npm run build'
            }),
        });

        // This is where we add the application stages

        //######################### PreProd #########################
        // pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'PreProd', {
        //     env: {account: '268591637005', region: 'us-east-1'}
        //     }));
        const preprod = new CdkpipelinesDemoStage(this, 'PreProd', {
           env: {account: '268591637005', region:'us-east-1'}
        });
        const preprodStage = pipeline.addApplicationStage(preprod);
        preprodStage.addActions(new ShellScriptAction({
            actionName: 'TestService',
            useOutputs: {
                ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput),
            },
            commands:[
                'curl -Ssf $ENDPOINT_URL',
            ],
        }));

        //######################### Prod #########################
        pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'Prod', {
            env: {account: '268591637005', region: 'us-east-1'}
        }));

    }
}