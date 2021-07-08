# Cloudflare worker for Cloudfront URL signing

![Workflow](/workflow.png)

## Overview

Sign Cloudfront URL with Cloudflare Worker

## Prerequisites

- Install [Wrangler](https://github.com/cloudflare/wrangler)
- Run `wrangler login` and follow the prompt
- Generate Public & private key

```
openssl genrsa -des3 -out private.pem 2048
openssl rsa -in private.pem -out private_unencrypted.pem -outform PEM
ssh-keygen -y -f private_unencrypted.pem > public.pub
ssh-keygen -f public.pub -e -m pem > public.pem
```

### Cloudflare Setup

- Update `wrangler.toml` accordingly for your project
- Insert secrets `KEYPAIR_ID` & `PRIVATE_KEY` 
  - try `pbpaste | wrangler secret put PRIVATE_KEY`  
 - Run `npm install` to install required modules
- Run `wrangler publish` to deploy
- (Optional) Run `wrangler tail` to tail the log

### Cloudfront Setup

- Register public key under `Public keys` in CloudFront
- Create a `key group` and select pubic key & distribution
  - Copy the string under `Public keys` and use it for Cloudflare secret `keyPairId`
- Go to cloudfront distribution -> behavior -> edit
- Enable `Restrict viewer access` and add the key group created in `Trusted key groups`
  - _Access will be restricted once it's saved so ensure your worker is ready beforehand_
