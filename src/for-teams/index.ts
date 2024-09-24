import { SNSHandler } from 'aws-lambda';
import https, { RequestOptions } from 'https';

import { IAdaptiveCard } from 'adaptivecards';

import { ProcessedEvent } from '../types';
import { adaptiveCardGeneratorFactory } from './adaptive-card-generator';

export const handler: SNSHandler = (event) => {
  const snsMessage = event.Records[0].Sns.Message as unknown as ProcessedEvent;

  console.info({ snsMessage });

  const generator = adaptiveCardGeneratorFactory(snsMessage);
  const headline = generator.getHeadline();
  const subHeadline = generator.getSubHeadline();
  const mainContent = generator.getMainContent();
  const actions = generator.getActions();

  const card = {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard',
    version: '1.3',
    body: headline.concat(subHeadline ?? [], mainContent),
    actions,
  } satisfies IAdaptiveCard;

  const payload = JSON.stringify({
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: card,
      },
    ],
  });

  const webhookUrl = process.env.TEAMS_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('TEAMS_WEBHOOK_URL is not defined');
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
    },
  } satisfies RequestOptions;

  const req = https.request(webhookUrl, options, (res) => {
    let responseBody = '';
    res.on('data', (chunk) => {
      responseBody += chunk;
    });
    res.on('end', () => {
      console.info(`Teams response status: ${res.statusCode}`);
      console.info(`Teams response body: ${responseBody}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Error sending to Teams: ${e}`);
  });

  req.write(payload);
  req.end();
};
