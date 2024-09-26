const { getInput } = require('@actions/core');
const AWS = require('aws-sdk');

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

const ec2 = new AWS.EC2();

module.exports = {
    accessKeyId,
    secretAccessKey,
    region,
    SecurityGroupId,
    port,
    toPort,
    protocol,
    description,
    ec2
};