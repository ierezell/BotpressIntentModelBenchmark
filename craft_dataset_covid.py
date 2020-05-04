import json

LANG = "en"
# LANG = "fr"
MODE = "id"
# MODE = "ctx"


with open("./qna_01-05-2020.json", "r") as file:
    dict_covid = json.load(file)
dict_covid = dict_covid["qnas"]

data_covid = {"datas": []}
for qna in dict_covid:
    if MODE == "id":
        # intent = "_".join(qna["id"].split("_")[1:])
        intent = qna["id"]
    elif MODE == "ctx":
        intent = qna["data"]["contexts"][0]
    else:
        raise AssertionError("MODE = ctx ou id")

    for utt in qna["data"]["questions"][LANG]:
        # print((utt, intent))
        data_covid["datas"].append((utt, intent))

with open(f"./datas/covid_{MODE}/{LANG}/covid_datas.json", "w+") as file:
    json.dump(data_covid, file)
