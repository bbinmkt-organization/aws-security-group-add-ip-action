import { getInput } from '@actions/core';
import AWS from 'aws-sdk';

const accessKeyId = getInput('aws-access-key-id', { required: true });
const secretAccessKey = getInput('aws-secret-access-key', { required: true });
const region = getInput('aws-region', { required: true });
const SecurityGroupId = getInput('aws-security-group-id', { required: true });
const port = getInput('port', { required: false });
const toPort = getInput('to-port', { required: false });
const protocol = getInput('protocol', { required: false });
const description = getInput('description', { required: false });

AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region
});

console.log('config :: ', {
    accessKeyId,
    secretAccessKey,
    region,
    SecurityGroupId,
    port,
    toPort,
    protocol,
    description
});

const ec2 = new AWS.EC2();

export { ec2, SecurityGroupId, protocol, port, toPort, description };