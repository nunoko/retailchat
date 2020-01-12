const functions = require("firebase-functions");
const request = require("request-promise");
const config = require("./config.json");

//[1]เพิ่ม dialogflow-fulfillment library
//[7] เพิ่ม Payload
const { WebhookClient, Payload } = require("dialogflow-fulfillment");

//ตั้งค่า region และปรับ timeout และเพิ่ม memory
const region = "asia-east2";
const runtimeOptions = {
  timeoutSeconds: 4,
  memory: "2GB"
};

//ทำ webhook request url
exports.webhook = functions
  .region(region)
  .runWith(runtimeOptions)
  .https.onRequest(async (req, res) => {
    console.log("LINE REQUEST BODY", JSON.stringify(req.body));

    //[2] ประกาศ ตัวแปร agent
    const agent = new WebhookClient({ request: req, response: res });

    //[4] ทำ function view menu เพื่อแสดงผลบางอย่างกลับไปที่หน้าจอของ bot
    const viewMenu = async agent => {
      //[5] เพิ่ม flex message
      const flexMenuMsg = {
        
          "type": "flex",
          "altText": "Flex Message",
          "contents": {
              "type": "bubble",
              "header": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "Noky Cafe",
                  "size": "xl",
                  "weight": "bold"
                }
              ]
            },
            "hero": {
              "type": "image",
              "url": "https://images.pexels.com/photos/1415555/pexels-photo-1415555.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
              "size": "full",
              "aspectRatio": "2:1"
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "contents": [
                {
                  "type": "box",
                  "layout": "baseline",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Americano",
                      "margin": "sm",
                      "weight": "bold",
                      "action": {
                        "type": "message",
                        "label": "Americano",
                        "text": "Americano"
                      }
                    },
                    {
                      "type": "text",
                      "text": "80 บาท",
                      "size": "sm",
                      "align": "end",
                      "color": "#AAAAAA"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Espresso",
                      "margin": "sm",
                      "weight": "bold",
                      "action": {
                        "type": "message",
                        "label": "Espresso",
                        "text": "Espresso"
                      }
                    },
                    {
                      "type": "text",
                      "text": "100 บาท",
                      "size": "sm",
                      "align": "end",
                      "color": "#AAAAAA"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "spacing": "sm",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Cappuchino",
                      "margin": "sm",
                      "weight": "bold",
                      "action": {
                        "type": "message",
                        "label": "Cappuchino",
                        "text": "Cappuchino"
                      }
                    },
                    {
                      "type": "text",
                      "text": "110 บาท",
                      "size": "sm",
                      "align": "end",
                      "color": "#AAAAAA"
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "spacer",
                  "size": "xxl"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "uri",
                    "label": "Add to Cart",
                    "uri": "https://linecorp.com"
                  },
                  "color": "#905C44",
                  "style": "primary"
                }
              ]
            }
          }
        
      };

      //[6] ปรับการตอบกลับ ให้ตอบกลับผ่าน flex message ด้วย Payload
      const payloadMsg = new Payload("LINE", flexMenuMsg, {
        sendAsMessage: true
      });
      return agent.add(payloadMsg);
    };

    //[3] ทำ intent map เข้ากับ function
    let intentMap = new Map();
    intentMap.set("view-menu", viewMenu);
    agent.handleRequest(intentMap);

    //[0] ดึงข้อมูลจาก request message ที่มาจาก LINE
    //const replyToken = req.body.events[0].replyToken;
    // const messages = [
    //   {
    //     type: "text",
    //     text: req.body.events[0].message.text //ดึง message ที่ส่งเข้ามา
    //   },
    //   {
    //     type: "text",
    //     text: JSON.stringify(req.body) //ลองให้พ่น สิ่งที่่ LINE ส่งมาให้ทั้งหมดออกมาดู
    //   }
    // ];

    // //ยิงข้อความกลับไปหา LINE (ส่ง response กลับไปหา LINE)
    // return lineReply(replyToken, messages);
  });

//function สำหรับ reply กลับไปหา LINE โดยต้องการ reply token และ messages (array)
const lineReply = (replyToken, messages) => {
  const body = {
    replyToken: replyToken,
    messages: messages
  };
  return request({
    method: "POST",
    uri: `${config.lineMessagingApi}/reply`,
    headers: config.lineHeaders,
    body: JSON.stringify(body)
  });
};