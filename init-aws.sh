#!/bin/bash
awslocal sqs create-queue --queue-name nova-cobranca
awslocal sqs create-queue --queue-name cobranca-gerada
awslocal sqs create-queue --queue-name falha-cobranca