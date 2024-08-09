# Botpress-Chatwoot Integration Module

This custom module connects Botpress to Chatwoot.
Index
1. Configuration
2. Message Endpoint

## 1 Configuration
- `secureString`: A string for protecting endpoints (Char).
- `languageCode`: A string for setting the language code in incoming events (Char).
- `timezone`: An integer for setting the timezone in incoming events (Integer).

## 2 Message Endpoint

The 'message-endpoint' is a post endpoint used for receiving messages from Chatwoot: 
https://your-botpress-url.com/api/v1/bots/webhook/mod/chatwoot-webhook/message-endpoint/{secureString}

### 2.1 JSON Format
The 'message-endpoint' wants to receive the following json structure as formatted by agentBot in Chatwoot.
```json
{
  "account": {
    "id": "",
    "name": ""
  },
  "additional_attributes": {},
  "content_attributes": {},
  "content_type": "",
  "content": "",
  "conversation": {
    "additional_attributes": {},
    "can_reply": "",
    "channel": "",
    "contact_inbox": {
      "id": "",
      "contact_id": "",
      "inbox_id": "",
      "source_id": "",
      "created_at": "",
      "updated_at": "",
      "hmac_verified": "",
      "pubsub_token": ""
    },
    "id": "",
    "inbox_id": "",
    "messages": [
      {
        "id": "",
        "content": "",
        "account_id": "",
        "inbox_id": "",
        "conversation_id": "",
        "message_type": "",
        "created_at": "",
        "updated_at": "",
        "private": "",
        "status": "",
        "source_id": "",
        "content_type": "",
        "content_attributes": {},
        "sender_type": "",
        "sender_id": "",
        "external_source_ids": {},
        "additional_attributes": {},
        "processed_message_content": "",
        "sentiment": {},
        "conversation": {
          "assignee_id": "",
          "unread_count": "",
          "last_activity_at": "",
          "contact_inbox": {
            "source_id": ""
          }
        },
        "sender": {
          "additional_attributes": {
            "city": "",
            "country": "",
            "description": "",
            "company_name": "",
            "country_code": "",
            "social_profiles": {
              "github": "",
              "twitter": "",
              "facebook": "",
              "linkedin": "",
              "instagram": ""
            }
          },
          "custom_attributes": {},
          "email": "",
          "id": "",
          "identifier": "",
          "name": "",
          "phone_number": "",
          "thumbnail": "",
          "type": ""
        }
      }
    ],
    "labels": [],
    "meta": {
      "sender": {
        "additional_attributes": {
          "city": "",
          "country": "",
          "description": "",
          "company_name": "",
          "country_code": "",
          "social_profiles": {
            "github": "",
            "twitter": "",
            "facebook": "",
            "linkedin": "",
            "instagram": ""
          }
        },
        "custom_attributes": {},
        "email": "",
        "id": "",
        "identifier": "",
        "name": "",
        "phone_number": "",
        "thumbnail": "",
        "type": ""
      },
      "assignee": "",
      "team": "",
      "hmac_verified": ""
    },
    "status": "",
    "custom_attributes": {},
    "snoozed_until": "",
    "unread_count": "",
    "first_reply_created_at": "",
    "priority": "",
    "waiting_since": "",
    "agent_last_seen_at": "",
    "contact_last_seen_at": "",
    "timestamp": "",
    "created_at": ""
  },
  "created_at": "",
  "id": "",
  "inbox": {
    "id": "",
    "name": ""
  },
  "message_type": "",
  "private": "",
  "sender": {
    "account": {
      "id": "",
      "name": ""
    },
    "additional_attributes": {
      "city": "",
      "country": "",
      "description": "",
      "company_name": "",
      "country_code": "",
      "social_profiles": {
        "github": "",
        "twitter": "",
        "facebook": "",
        "linkedin": "",
        "instagram": ""
      }
    },
    "avatar": "",
    "custom_attributes": {},
    "email": "",
    "id": "",
    "identifier": "",
    "name": "",
    "phone_number": "",
    "thumbnail": ""
  },
  "source_id": "",
  "event": ""
}
```

### 2.2 Usage
This endpoint should be set as Outgoing URL in Chatwoot agentBot Config, the messages will automaticcaly be formatted correctly.

### 2.3 Access Data
The 'messages.content' will be available in the incoming event as 'event.preview' or 'event.payload.text'
The 'conversation.id' will be available in the incoming event as 'event.threadId'
The 'account.{variable} will be available in the incoming event as 'event.payload.accountData.{variable}'
The 'inbox.{variable} will be available in the incoming event as 'event.payload.inboxData.{variable}'
The 'sender.{variable} will be available in the incoming event as 'event.payload.userData.{variable}'

## 3 SFM Endpoint

The 'sfm-endpoint' is a post endpoint used for sending the first (template) message to botpress:
https://your-botpress-url.com/api/v1/bots/webhook/mod/chatwoot-webhook/pfm-endpoint/{secureString}

### 3.1 JSON Format
The sfm endpoint wants to receive the following json structure
```json
{
  "account": {
    "id": "",
    "name": ""
  },
  "inbox": {
    "id": "",
    "name": ""
  },
  "bot": {
    "id": ""
  },
  "contact": {
    "id": "",
    "name": "",
    "phone": "",
    "email": "",
    "identifier": "",
    "additional_attributes": {
      "city": "",
      "country": "",
      "description": "",
      "company_name": "",
      "country_code": "",
      "social_profiles": {
        "github": "",
        "twitter": "",
        "facebook": "",
        "linkedin": "",
        "instagram": ""
      }
    },
    "custom_attributes": {}
  },
  "conversation": {
    "id": ""
  },
  "message": {
    "first_message": "",
    "template": {
      "id": "",
      "category": "",
      "language_code": "",
      "variable_1": "",
      "variable_2": "",
      "variable_3": "",
      "variable_4": "",
      "variable_5": "",
      "variable_6": "",
      "variable_7": "",
      "variable_8": ""
    }
  }
}
```
If any of the main key's is missing in the json of the post request, the request will be considered bad.

### 3.2.1 Regular Media Usage 
For regular media, use message.first_message and leave template dictionary empty in the json structure.

### 3.2.2 Regular Media Access Data 
The 'message.first_message' will be available in the incoming event as 'event.payload.firstMessage.messageData.content'
The 'conversation.id' will be available in the incoming event as 'event.threadId'
The 'account.{variable} will be available in the incoming event as 'event.payload.accountData.{variable}'
The 'inbox.{variable} will be available in the incoming event as 'event.payload.inboxData.{variable}'
The 'contact.{variable} will be available in the incoming event as 'event.payload.userData.{variable}'

### 3.3.1 WhatsApp Usage 
For WhatsApp, use message.template dictionary and leave message.first_message empty in the json structure.

### 3.3.2 WhatsApp Access Data 
The 'message.template.{variable}' will be available in the incoming event as event.payload.firstMessage.templateData.{variable}
The 'conversation.id' will be available in the incoming event as 'event.threadId'
The 'account.{variable} will be available in the incoming event as 'event.payload.accountData.{variable}'
The 'inbox.{variable} will be available in the incoming event as 'event.payload.inboxData.{variable}'
The 'contact.{variable} will be available in the incoming event as 'event.payload.userData.{variable}'
