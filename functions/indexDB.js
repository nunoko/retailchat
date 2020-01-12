const functions = require("firebase-functions");
const request = require("request-promise");
const config = require("./config.json");

//[1]เพิ่ม dialogflow-fulfillment library
//[7] เพิ่ม Payload
const { WebhookClient, Payload } = require("dialogflow-fulfillment");

//[8] เพิ่ม firebase-admin และ initial database
const firebase = require("firebase-admin");
firebase.initializeApp({
  credential: firebase.credential.applicationDefault(),
  databaseURL: config.databaseURL
});
var db = firebase.firestore();

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
      //[9] แก้ไข flex message ให้ dynamic ได้
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
      //[10] ปรับให้ต่อ database ได้ ตอบกลับผ่าน flex message ด้วย Payload
      return db
      .collection("Menu")
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          let itemData =  {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": data.name,
                "margin": "sm",
                "weight": "bold",
                "action": {
                  "type": "message",
                  "label": data.name,
                  "text": data.name
                }
              },
              {
                "type": "text",
                "text": `${data.price} บาท`,
                "size": "sm",
                "align": "end",
                "color": "#AAAAAA"
              }
            ]
          };
          flexMenuMsg.contents.body.contents.push(itemData);
        });

        const payloadMsg = new Payload("LINE", flexMenuMsg, {
          sendAsMessage: true
        });
        return agent.add(payloadMsg);
      })
      .catch(error => {
        return response.status(500).send({
          error: error
        });
      });
    };        

    //[12]ทำ method เพื่อรองรับ intent view-menu-select - yes 
    const viewMenuSelect = async agent => {
      //ดึงข้อมูลจาก parameters ขึ้นมาแสดง 
      const coffee = req.body.queryResult.parameters.coffee;
      const type = req.body.queryResult.parameters.type;
      const total = req.body.queryResult.parameters.total;
      
      //สมมุติค่า orderNo ขึ้นมาก่อน
      const orderNo = 10;
      const orderNoStr = orderNo.toString().padStart(4, "0");
      
      //สร้างข้อความในการ response กลับไป
      const notifyMsg = `คุณสั่ง ${type} ${coffee} ${total} แก้ว สามารถติดตามออเดอร์ได้ที่ Order No:${orderNoStr}`;
      agent.add(notifyMsg);
    };

    //[3] ทำ intent map เข้ากับ function
    let intentMap = new Map();
    intentMap.set("view-menu", viewMenu);

    //[11] เพิ่ม intentMap view-menu-select - yes
    intentMap.set("view-menu-select - yes", viewMenuSelect);
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