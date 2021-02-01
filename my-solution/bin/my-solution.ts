#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { MySolutionStack } from '../lib/my-solution-stack';

const app = new cdk.App();
new MySolutionStack(app, 'MySolutionStack');
