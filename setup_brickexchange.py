import requests
import random


prices = {
    "6211-1": 400,
    "75055-1": 250,
    "75054-1": 150,
    "7161-1": 155,
    "75058-1": 250,
    "7672-1": 365,
    "76269-1": 420,
    "76214-1": 45,
    "76252-1": 330,
    "76139-1": 34,
    "76153-1": 115,
    "10189-1": 600,
    "10214-1": 250,
    "10234-1": 375
}

def wrap_string(s):
    return f'"{s}"'

STORE_NAME = wrap_string('brickexchange')
print("INSERT INTO products (store_name, image_url, category, title, description, price, quantity) VALUES")
# Generate data using Rebrickable API
for set_number in prices:
    res = requests.get(f'https://rebrickable.com/api/v3/lego/sets/{set_number}',
                 headers={'Authorization': 'key 4c175dc9706337fec5d5f90f0a14b65c'})
    res = res.json()
    title = wrap_string(f"{res['year']} {res['name']}")
    image_url = wrap_string(res['set_img_url'])
    quantity = str(random.randint(1, 5))
    description = wrap_string(f'A new-in-box and sealed {res["year"]} {res["name"]}.')
    theme_id = res['theme_id']
    res_theme = requests.get(f"https://rebrickable.com/api/v3/lego/themes/{theme_id}/",
                             headers={'Authorization': 'key 4c175dc9706337fec5d5f90f0a14b65c'})
    res_theme = res_theme.json()
    category = wrap_string(res_theme['name'])
    price = str(prices[set_number])
    print("(" + ", ".join([STORE_NAME, image_url, category, title, description, price, quantity]) + ")")
