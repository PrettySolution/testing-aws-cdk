import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as MySolution from '../lib/my-solution-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MySolution.MySolutionStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
