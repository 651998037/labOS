const controller = {};

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const token =
  "AGB55bvbOoYPsmuYb8lv4GIBKC2vmb-Ut8x4by_FlJNdf0_mCWbIVwWyBJ0X4XMODH2qAroVGHzetsoLuHxnQg==";
const url = "https://us-east-1-1.aws.cloud2.influxdata.com";
const client = new InfluxDB({ url, token });
let org = `74554ba6d34f8f12`;
let bucket = `DHT`;


let writeClient = client.getWriteApi(org, bucket, 'ns')

let point = new Point('dht')
.tag('device','abc')
.intField('temp',50)
void setTimeout(() => {
writeClient.writePoint(point)
}, 1000) // separate points by 1 second
void setTimeout(() => {
writeClient.flush()
}, 5000)

controller.project = (req, res) => {
  // res.send('Hello IOT');
  var projectvalue = null;
  let queryClient = client.getQueryApi(org);
  let fluxQuery = `from(bucket: "DHT")
|> range(start: -5m)
|> filter(fn: (r) => r._measurement == "dht")
|> filter(fn: (r) => r["device"] == "abc")
|> filter(fn: (r) => r["_field"] == "temp")
|> last()`;
  var j = 0;
  queryClient.queryRows(fluxQuery, {
    next: (row, tableMeta) => {
      const tableObject = tableMeta.toObject(row);
      console.log(tableObject._value);
      projectvalue = tableObject._value;
      j++;
    },
    error: (error) => {
      console.error("\nError", error);
    },
    complete: () => {
      const step = (prop) => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(`done ${prop}`), 100);
        });
      };
      res.render("iotProject", { data: projectvalue });
    },
  });
};

module.exports = controller;
