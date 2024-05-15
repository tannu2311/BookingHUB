import { NextResponse } from "next/server"
import auotoresponders from "@/models/Autoresponders"
import { getToken } from "next-auth/jwt"
import Mailchimp from 'mailchimp-api-v3';
import axios from "axios";
import campaignsModel from "@/models/campaigns";
import campaignDetailModel from "@/models/campaignDetail";

export const dynamic = 'force-dynamic'

//get the list of autoresponder

export async function GET(request) {
    try {

        const token = await getToken({ req: request })
        const userid = token.sub

        let autoresponderList = await auotoresponders.find({ 'userId': userid })

        return NextResponse.json({status:1 ,autoresponder:autoresponderList})
    } catch (error) {
        return NextResponse.json({ message: error.message, status : 0 })
    }

}

//disconnect autoresponder
export async function DELETE(request) {
    try {
      const token = await getToken({ req: request });
      const userId = token.sub;
      const ar = request.nextUrl.searchParams.get('autoresponder');
 
      // Find the autoresponder to delete
      const existingData = await auotoresponders.findOne({
        userId,
        [`autoresponder.${ar}`]: { $exists: true },
      });
  
      if (!existingData) {
        return NextResponse.json({
          error: 'Autoresponder not connected.',status: 0,
        });
      }
      //delete it from its campaigns 
      const campaigns = await campaignsModel.find({'userId' : userId}).select('_id');

      campaigns.map( async(camp) => {
        let campaignDetail = await campaignDetailModel.findOne({ 'campaignId': camp._id });

        if(campaignDetail.Details.autoresponder)
        {
          if(campaignDetail.Details.autoresponder.name === ar)
          {
            await campaignDetailModel.updateOne(
              { 'campaignId': camp._id }, 
              { $unset: { "Details.autoresponder": "" } } 
            );
          }
        }
      })

      // Delete the autoresponder
      await auotoresponders.findByIdAndDelete(existingData);
  
      return NextResponse.json({ message: 'Successfully disconnected autoresponder.', status: 1 });
    } catch (error) {
      return NextResponse.json({ message : error.message, status : 0 });
    }
}

//integration code

export async function POST(request) {

    const reqBody = await request.json()
    var { Api_key, Url, grant_type, client_secret, secret_key, code } = reqBody
  
    const Autoresponder = request.nextUrl.searchParams.get('Autoresponder')
    const token = await getToken({ req: request })
    try {
  
      if (Autoresponder === 'GetResponse') {
  
       
        const response = await fetch('https://api.getresponse.com/v3/campaigns', {
          method: 'GET',
          headers: {
            'X-Auth-Token': `api-key ${Api_key}`,
          },
        });

        if (response.ok) {
          const list = await response.json();
        
          const listData = [];
    
  
          if (list.length > 0) {
            list.forEach((v) => {
              listData.push({
                id: v.campaignId,
                name: v.name,
              });
            });
  
            const existingData = await auotoresponders.findOne({
              userId: token.sub,
              'autoresponder.GetResponse.Api_key': Api_key,
            });
  
            if (existingData) {
              // Data already exists, perform an update
              existingData.autoresponder.GetResponse.Api_key = Api_key;
              await existingData.save();
  
  
            } else {
              // Data doesn't exist, create a new record
              const autoresponderData = {
                userId: token.sub,
                autoresponder: {
                  'GetResponse': {
                    Api_key: Api_key,
                    listsData: listData,
                  }
                }
              };
  
  
              let updated = await auotoresponders.create(autoresponderData)
            
              
              return NextResponse.json({ listData, message: "Connected Successfully!!", status: 1 });
            }
          } else {
            return NextResponse.json({ message: 'There is no list in your account.', status: 0 });
  
          }
        } else {
          const errorData = await response.json();
          return NextResponse.json({ error: errorData.message, message: "Unauthorized API Key!!'", status: 0 });
        }
  
  
      }
      else if (Autoresponder == "Mailchimp") {
        const mailchimp = new Mailchimp(Api_key);
        const lists = await mailchimp.get('/lists');
        const listMap = [];
  
        if (lists.lists.length > 0) {
          for (const list of lists.lists) {
            listMap.push({ id: list.id, name: list.name });
          }
       
  
          const existingData = await auotoresponders.findOne({
            userId: token.sub,
            'autoresponder.Mailchimp.Api_key': Api_key,
          });
  
          if (!existingData) {
            // Data doesn't exist, create a new record
            const autoresponderData = {
              userId: token.sub,
              autoresponder: {
                'Mailchimp': {
                  Api_key: Api_key,
                  listsData: listMap,
                }
              }
            };
  
            const updated = await auotoresponders.create(autoresponderData);
           
          }
  
          return NextResponse.json({ list: listMap, message: "Connected Successfully!!", status: 1 });
        } else {
          return NextResponse.json({ error: 'There is no list in your account.', status: 0 });
        }
  
      }
      else if (Autoresponder == "ConvertKit") {
        const response = await axios.get(`https://api.convertkit.com/v3/forms?api_key=${Api_key}`);
        const forms = response.data;
  
  
        if (forms.error) {
          return NextResponse.json({ error: forms.message });
        } else if (forms.forms && forms.forms.length > 0) {
          const listData = forms.forms.map((form) => ({
            id: form.id,
            name: form.name,
          }));
  
  
  
          const existingData = await auotoresponders.findOne({
            userId: token.sub,
            'autoresponder.ConvertKit.Api_key': Api_key,
          });
  
          if (existingData) {
            // Data already exists, perform an update
            existingData.autoresponder.ConvertKit.Api_key = Api_key;
            existingData.autoresponder.ConvertKit.secret_key = secret_key;
            await existingData.save();
  
  
            return NextResponse.json({ listData, message: "Updated Successsfully!!", status: 1 });
          } else {
            // Data doesn't exist, create a new record
            const autoresponderData = {
              userId: token.sub,
              autoresponder: {
                'ConvertKit': {
                  Api_key: Api_key,
                  secret_key: secret_key,
                  listsData: listData
                }
              }
            };
  
            let updated = await auotoresponders.create(autoresponderData)
  
            return NextResponse.json({ listData, message: "Connected Successsfully!!", status: 1 });
          }
  
  
        } else {
          return NextResponse.json({ error: 'An error occurred while getting your list.' });
        }
  
      }
      else if (Autoresponder == "ActiveCampaign") {
        const params = new URLSearchParams({
          api_key: Api_key,
          api_action: 'list_paginator',
          api_output: 'json',
          somethingthatwillneverbeused: '',
          sort: '',
          offset: 0,
          limit: 20,
          filter: 0,
          public: 0,
        });
  
  
        const apiUrl = `${Url}/admin/api.php?${params.toString()}`;

        const response = await fetch(apiUrl);

        const data = await response.json();
  
        if (response.ok) {
          const list = {};
  
          if (data.cnt === 0) {
            return NextResponse.json({ error: 'There is no list in your account.' });
          }
  
          const listsData = data.rows.map((solo_list) => {
            return {
              id: solo_list.id,
              name: solo_list.name,
            };
          });
  
          const existingData = await auotoresponders.findOne({
            userId: token.sub,
            'autoresponder.ActiveCampaign.Api_key': Api_key,
          });
  
          if (!existingData) {
  
  
            const autoresponderData = {
              userId: token.sub,
              autoresponder: {
                'ActiveCampaign': {
                  Api_key: Api_key,
                  Api_Url: Url,
                  listsData: listsData,
                }
              }
            };
  
            let updated = await auotoresponders.create(autoresponderData)

  
            return NextResponse.json({ list, message: "Connected Successsfully!", status: 1 });

          }
  
        } else {
          const errorData = await response.json();
          return NextResponse.json({ error: errorData.message });
        }
  
      }
  
      else if (Autoresponder == "Aweber") {
        const redirectUri = `${process.env.APP_URL}/connection/Aweber`;
        const basic = Buffer.from(`${process.env.AWEBER_CLIENT_ID}:${process.env.AWEBER_CLIENT_SECRET}`).toString('base64');
  
        const tokenResponse = await fetch(`https://auth.aweber.com/oauth2/token?grant_type=authorization_code&code=${code}&redirect_url=${redirectUri}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'auth.aweber.com',
          },
  
        });
  
        const tokenData = await tokenResponse.json();
  
  
        const refreshToken = tokenData.refresh_token
  
        const response = await fetch(`https://auth.aweber.com/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&redirect_url=${redirectUri}`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basic}`,
          },
        });
  
        const responseData = await response.json()
  
        const Newtoken = responseData.access_token

        if (responseData.access_token) {
          // Extract the access token
          const accessToken = responseData.access_token;
          const apiEndpoint = `https://api.aweber.com/1.0/accounts`;
  
          const aweberResponse = await fetch(apiEndpoint, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          });
  
          const aweberData = await aweberResponse.json();
  
          if (aweberData.entries && aweberData.entries.length > 0) {
            const accountId = aweberData.entries[0].id;
            const listsEndpoint = `https://api.aweber.com/1.0/accounts/${accountId}/lists`;
  
            const listsResponse = await fetch(listsEndpoint, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });
  
            const listsData = await listsResponse.json();
  
  
  
            if (tokenData.refresh_token) {
  
  
              const autoresponderData = {
                userId: token.sub,
                autoresponder: {
                  'Aweber': {
                    refresh_token: tokenData.refresh_token,
                    listsData: listsData.entries.map(list => ({ id: list.id, name: list.name })),
                    accountId: accountId
  
                  }
                }
              };
  
              let created = await auotoresponders.create(autoresponderData);
          
            }
  
            return NextResponse.json({ message: 'Successfully Connected', listsData, status: 1 });
          } else {
            return NextResponse.json({ message: 'Unauthorize Api and Secret Key!', status: 0 });
          }
  
        }
      }
  
      else if (Autoresponder == "SendPulse") {
  
        // Check if data already exists for the user
        const existingData = await auotoresponders.findOne({ userId: token.sub, 'autoresponder.SendPulse.client_id': Api_key });
  
  
        if (existingData) {
          // Data already exists, perform an update
          const updatedData = {
            userId: token.sub,
            autoresponder: {
              'SendPulse': {
                client_id: Api_key,
                client_secret: client_secret,
              }
            }
          };
  
          const updated = await auotoresponders.findByIdAndUpdate(existingData._id, updatedData);
  
        } else {
          // Data doesn't exist, create a new record
          const data = new FormData();
          data.append('client_id', Api_key);
          data.append('client_secret', client_secret);
          data.append('grant_type', grant_type);
  
          const response = await fetch('https://api.sendpulse.com/oauth/access_token', {
            method: 'POST',
            body: data,
          });
  
          if (response.ok) {
            const responseData = await response.json();
  
  
            // Extract the access token
            const accessToken = responseData.access_token;
  
            const addressbooksResponse = await fetch('https://api.sendpulse.com/addressbooks', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            });
      
  
            if (addressbooksResponse.ok) {
              const addressbooksData = await addressbooksResponse.json();
              const listData = addressbooksData.map((book) => ({
                id: book.id,
                name: book.name,
              }));
  
              const autoresponderData = {
                userId: token.sub,
                autoresponder: {
                  'SendPulse': {
                    client_id: Api_key,
                    client_secret: secret_key,
                    access_token: accessToken,
                    listsData: listData
                  }
                }
              };
  
              let created = await auotoresponders.create(autoresponderData);
      
  
              return NextResponse.json({ addressbooksData, message: "Successfully Connected!!", status: 1 })
            } else {
              return NextResponse.json({ error: 'Error fetching addressbooks', status: 0 });
            }
          } else {
            return NextResponse.json({ message: "Unauthorize Api and Secret Key!!", status: 0 });
          }
        }
      }
  
      else if (Autoresponder == "SendGrid") {
        const response = await fetch('https://api.sendgrid.com/v3/marketing/lists', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${Api_key}`,
          },
        });
  
        if (response.ok) {
          const list = await response.json();
        
          const listData = [];
    
  
          if ((list.result).length > 0) {
            list.result.forEach((v) => {
              listData.push({
                id: v.id,
                name: v.name,
              });
  
            });
  
            const existingData = await auotoresponders.findOne({
              userId: token.sub,
              'autoresponder.SendGrid.Api_key': Api_key,
            });
  
            if (existingData) {
              // Data already exists, perform an update
              existingData.autoresponder.GetResponse.Api_key = Api_key;
              await existingData.save();
        
  
  
            } else {
              // Data doesn't exist, create a new record
              const autoresponderData = {
                userId: token.sub,
                autoresponder: {
                  'SendGrid': {
                    Api_key: Api_key,
                    listsData: listData,
                  }
                }
              };
  
  
              let updated = await auotoresponders.create(autoresponderData)
  
              return NextResponse.json({ list: listData, message: "Connected Successfully!!", status: 1 });
            }
  
  
          } else {
            return NextResponse.json({ error: 'There is no list in your account.' });
          }
        } else {
          return NextResponse.json({ message: "Unauthorize API Key!!", status: 0 })
  
        }
  
      }
      else if (Autoresponder == "Constant-Contact") {
        const redirectUri = `${process.env.APP_URL}/connection/Constant-Contact`;
        const basic = Buffer.from(`${process.env.CONSTANT_CONTACT_CLIENT_ID}:${process.env.CONSTANT_CONTACT_CLIENT_SECRET}`).toString('base64');
    
        const tokenResponse = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
    
        const tokenData = await tokenResponse.json();
      
    
        if (tokenResponse.ok) {
  
            const listsResponse = await fetch('https://api.cc.email/v3/contact_lists?include_count=true&include_membership_count=all', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
              },
            });
    
      
    
            if (listsResponse.ok) {
              let listsData = await listsResponse.json();
              const Data = []
              if ((listsData.lists).length > 0) {
                listsData.lists.forEach((v) => {
                  Data.push({
                    id: v.list_id,
                    name: v.name,
                  });
    
                });
              }
    
              const autoresponderData = {
                userId: token.sub,
                autoresponder: {
                  'Constant-Contact': {
                    refresh_token: tokenData.refresh_token,
                    listsData: Data
                  }
                }
              };
              let created = await auotoresponders.create(autoresponderData);
        
    
              return NextResponse.json({ listsData, message: "Successfully Connected Constant Contact", status: 1 });
            } 
        } else {
    
          return NextResponse.json({ message: "Invalid ", status: 0 });
        }
      }
  
    } catch (error) {
      return NextResponse.json({ message: error.message, status: 0 })
    }
  }
  
//subscriber email add
export async function PUT(request) {
    const reqBody = await request.json()
    const { userId, email, id, name } = reqBody
    const Autoresponder = request.nextUrl.searchParams.get('Autoresponder')
    try {
      const existingData = await auotoresponders.findOne({
        userId,
        [`autoresponder.${Autoresponder}`]: { $exists: true },
      });
    
      const Api_key = existingData.autoresponder[Autoresponder].Api_key
      const api_secret = existingData.autoresponder[Autoresponder].secret_key
      const refresh_token = existingData.autoresponder[Autoresponder].refresh_token
      const access_token = existingData.autoresponder[Autoresponder].access_token
      const apiURL = existingData.autoresponder[Autoresponder].Api_Url
      const accountId = existingData.autoresponder[Autoresponder].accountId
      
    
      if (Autoresponder == "GetResponse") {
        if (id) {
          const args = {
            campaign: { campaignId: id },
            email: email,
  
          };
  
          const dataString = JSON.stringify(args);
          const response = await fetch('https://api.getresponse.com/v3/contacts', {
            method: 'POST',
            body: dataString,
            headers: {
              'X-Auth-Token': `api-key ${Api_key}`,
              'Content-Type': 'application/json',
              'Content-Length': dataString.length.toString(),
            },
          });
  
          if (response.ok) {
            return NextResponse.json({ success: "We've received your message! We'll get back to you soon." });
          } else {
            const errorData = await response.json();
            return NextResponse.json({ error: errorData.message });
          }
        }
  
      }
      else if (Autoresponder == "Mailchimp") {
        const mailchimp = new Mailchimp(Api_key);
        if (!id || !email) {
          return NextResponse.json({ error: 'Missing required data.', status: 0 });
        }
  
  
        // Create a member object for subscription
        const member = {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            FNAME: name || '',
  
          },
        };
  
        // Subscribe the member to the specified list
        const result = await mailchimp.post(`/lists/${id}/members`, member);
  
        if (result.status === 'subscribed') {
          return NextResponse.json({ message: 'Subscription successful.', status: 1 });
        } else if (result.status === 400) {
          const subscriber_hash = mailchimp.subscriberHash(email);

          const result = await mailchimp.post(`/lists/${id}/members/${subscriber_hash}`, member);
  
          return NextResponse.json({ message: 'Subscription successful.', result, status: 1 });
        } else {
          return NextResponse.json({ message: mailchimp.getLastError(), status: 0 });
        }
      }
      else if (Autoresponder == "ConvertKit") {
        const postData = `api_secret=${api_secret}&email=${email}`;
  
        const response = await axios.post(`https://api.convertkit.com/v3/forms/${id}/subscribe`, postData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
  
        const data = response.data;

  
        if (data.subscription) {
          return NextResponse.json({ success: 'Subscribed successfully.' });
        } else {
          return NextResponse.json({ error: 'Subscribe unsuccessfully, please contact administrator for more information.' });
        }
  
      }
      else if (Autoresponder == "ActiveCampaign") {
        const params = new URLSearchParams({
          api_key: Api_key,
          api_action: 'contact_add',
          api_output: 'json',
        });
  
        const postData = new URLSearchParams({
          email,
          first_name: name,
          tags: 'api',
          p: id,
          status: 1,
          instantresponders: 1,
        });
  
        const apiUrl = `${apiURL}/admin/api.php?${params.toString()}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: postData.toString(),
        });
  
        if (response.ok) {
          const data = await response.json();
          if (data.result_code === 1) {
            return NextResponse.json({ message: 'Contact subscribed successfully', status: 1 });
          } else {
            return NextResponse.json({ error: 'Subscription failed', status: 0 });
          }
        }
      }
      else if (Autoresponder == "SendPulse") {
        if (!email || !id) {
          return NextResponse.json({ error: 'Missing required data.', status: 0 });
        }
  
  
  
        if (!access_token) {
          return NextResponse.json({ error: 'Failed to get access token.', status: 0 });
        }
  
        const subscriberData = {
          emails: [
            {
              email:email,
              variables: {
                name:name
                
              },
            },
          ],
        };
  
        const response = await fetch(`https://api.sendpulse.com/addressbooks/${id}/emails`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscriberData),
        });
  
  
        if (response.ok) {
          return NextResponse.json({ message: 'Subscriber added successfully.', status: 1 });
        } else {
          const errorData = await response.json();
   
          return NextResponse.json({ error: 'Subscriber addition failed.', status: 0 });
        }
      }
      else if (Autoresponder == "Aweber") {
  
  
        const redirectUri = `http://localhost:3000/user/integrations`;
        const basic = Buffer.from(`${process.env.AWEBER_CLIENT_ID}:${process.env.AWEBER_CLIENT_SECRET}`).toString('base64');
        const response = await fetch(`https://auth.aweber.com/oauth2/token?grant_type=refresh_token&refresh_token=${refresh_token}&redirect_url=${redirectUri}`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basic}`,
          },
        });
  
        if (response.ok) {
          const responseData = await response.json();

          const Newtoken = responseData.access_token;

          const postdata = {
            email: email,
            strict_custom_fields: true,
            tags: ['slow', 'fast', 'lightspeed'],
          };
  
          const Subscribresponse = await fetch(`https://api.aweber.com/1.0/accounts/${accountId}/lists/${id}/subscribers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'accept': 'application/json',
              'authorization': `Bearer ${Newtoken}`,
            },
            body: JSON.stringify(postdata),
          });
  
          if (Subscribresponse.ok) {
            const subscriber = await Subscribresponse.json();
            return NextResponse.json({ success: "We've received your message! We'll get back to you soon." });
          } else {
            const errorResponse = await Subscribresponse.json();
            return NextResponse.json({ error: errorResponse.error.message });
          }
        } else {
          
          return NextResponse.json({ error: 'Failed to get access token' });
        }
  
      }
      else if (Autoresponder == "SendGrid") {
        const Data = {
          "contacts": [
            {
              "email": email,
            }
          ]
        }
  
        const response = await fetch(`https://api.sendgrid.com/v3/marketing/contacts`, {
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${Api_key}`,
          },
          body: JSON.stringify(Data)
  
        })
        if (response.ok) {
          const subscriber = await response.json();
          return NextResponse.json({ success: "We've received your message! We'll get back to you soon." });
        } else {
          const errorResponse = await response.json();
          return NextResponse.json({ error: errorResponse.error.message });
        }
  
      }
    
      else if (Autoresponder == "Constant-Contact") {
        const basic = Buffer.from(`${process.env.CONSTANT_CONTACT_CLIENT_ID}:${process.env.CONSTANT_CONTACT_CLIENT_SECRET}`).toString('base64');
        const redirectUri = 'http://localhost:3000/user/integrations';
        const ResponseData = await fetch(`https://authz.constantcontact.com/oauth2/default/v1/token?grant_type=refresh_token&refresh_token=${refresh_token}&redirect_url=${redirectUri}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basic}`
          },
        });
      
        if (ResponseData.ok) {
          const NewAccessToken = await ResponseData.json();

      
          const Data = {
            "email_address": {
              "address": email,
              "permission_to_send": "implicit"
            },
          }
      
          const response = await fetch(`https://api.cc.email/v3/contacts`, {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'authorization': `Bearer ${NewAccessToken.access_token}`,
            },
            body: JSON.stringify(Data)
          });
      
          if (response.ok) {
            const subscriber = await response.json();
            return NextResponse.json({ success: "We've received your message! We'll get back to you soon." });
          } else {
            const errorResponse = await response.json();
   
            return NextResponse.json({ error: 'Failed to create a Constant Contact contact.' });
          }
        } else {
    
          return NextResponse.json({ error: 'Failed to obtain an access token from Constant Contact.' });
        }
      }
      
    } catch (error) {

      return NextResponse.json({ message: error.message, status: 0 })
  
    }
}

