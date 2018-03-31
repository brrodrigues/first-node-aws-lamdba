'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.TABLE_NAME;

const createResponse = (_statusCode, _body) => {
    return {
        statusCode: _statusCode,
        body: _body
    }
}

exports.get = (event, context, callback) => {

    let params = {
        TableName : tableName,
        Key: {
            id: event.pathParameters.resourceId
        }
    };

    let dbGet = (params) => { return dynamo.get(params).promise() };

    dbGet(params).then( (data) => {
        if (!data.Item) {
            callback(null, createResponse(404, "ITEM NOT FOUND"));
            return;
        }
        console.log(`RETRIEVE ITEM SUCCESSFULLY WITH doc = ${data.Item.doc}`);
    }).catch( (err) => {
        console.log(`GET ITEM FAILED FOR doc =${params.Key.id}, with ERROR: ${err}`)
        callback(null, createResponse(500, err));
    });
};