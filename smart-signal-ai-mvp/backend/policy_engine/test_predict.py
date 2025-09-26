import requests

# ضع هنا عنوان endpoint الخاص بك بعد نشره
ENDPOINT_URL = "https://YOUR_ENDPOINT_URL_HERE"

sample = {
    "instances": [
        {
            "downlink_mbps": 30,
            "uplink_mbps": 5,
            "rssi_dbm": -70,
            "sinr_db": 20
        }
    ]
}

response = requests.post(ENDPOINT_URL, json=sample)
print(response.json())
