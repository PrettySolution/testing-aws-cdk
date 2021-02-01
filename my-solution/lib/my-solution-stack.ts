import * as cdk from '@aws-cdk/core';
import { CloudFrontToS3 } from "@aws-solutions-constructs/aws-cloudfront-s3";

export class MySolutionStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new CloudFrontToS3(this, 'cloudfront-s3', {
      // ... any properties here for the construct
    })
  }
}
