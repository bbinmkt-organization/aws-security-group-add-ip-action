import { getInput } from '@actions/core';
import { AWS } from 'aws-sdk';
export const accessKeyId = getInput('aws-access-key-id', { required: true });
export const secretAccessKey = getInput('aws-secret-access-key', { required: true });
export const region = getInput('aws-region', { required: true });
export const SecurityGroupId = getInput('aws-security-group-id', { required: true });
export const port = getInput('port', { required: false });
export const toPort = getInput('to-port', { required: false });
export const protocol = getInput('protocol', { required: false });
export const description = getInput('description', { required: false });



AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region
})
export const ec2 = new AWS.EC2();