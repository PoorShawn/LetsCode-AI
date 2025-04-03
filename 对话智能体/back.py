
import json
from flask import Flask, jsonify, request
import requests 
from flask_cors import CORS 
bot_id = '7488894264207048738'
#"7481182000779722802"

url = "https://api.coze.cn/v3/chat"
s_token = "pat_Du3vZq5b7dtoJsi2RKQFqwFCm1cRqCSnzgJ54D43nOgNzm7jBmXrE4sWzmkxbJG5"  # ✅ 确保使用最新的 Personal Access Token
headers = {
        "Authorization": f"Bearer {s_token}",
        "Content-Type": "application/json"
    }

app = Flask(__name__)
# 启用跨域请求支持
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/chat', methods=['POST'])


def chat():
    
    if request.method == 'OPTIONS':
        return '', 200  # 处理预检请求，返回 200 状态码
    try:
        print("Received POST request to /api/chat")

        # 获取 JSON 数据
        data = request.get_json(force=True)
        print("Received JSON:", data)

        if not data:
            return "请求失败: 没有收到数据", 400

        # 获取 message 字段
        prompt = data.get('message')
        print("Extracted prompt:", prompt)  # 确保 prompt 不是 None

        if not prompt:
            return jsonify({"error": "输入内容为空"}), 400

        # Choose API 
        #chat_response = chat_with_moonshot(prompt)
        chat_response = chat_with_coze(prompt)
        chat_reply = chat_response.get('ai_reply')
        chat_follow_up_set = chat_response.get('ai_follow_up')
        chat_follow_up_1 = chat_follow_up_set.get('1')
        chat_follow_up_2 = chat_follow_up_set.get('2')
        chat_follow_up_3 = chat_follow_up_set.get('3')

        '''
        # 确保 chat_response 是字符串
        if isinstance(chat_reply, dict) and "error" in chat_reply:
            return jsonify({"error": chat_reply["error"]}), 500

        if not isinstance(chat_reply, str):
            print("Error: chat_reply did not return a string.")
            return jsonify({"error": "AI 响应格式错误"}), 500
        '''
        #print('chat_response:',chat_response)
        #print("Final response to client:", chat_reply)
        print({"message": chat_reply,'suggestions':[chat_follow_up_1, chat_follow_up_2, chat_follow_up_3]})
        return jsonify({"message": chat_reply,})  # ✅ 确保返回 JSON


    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({"error": str(e)}), 500
    

def chat_with_coze(prompt):

    payload = {
        "bot_id": bot_id,
        "user_id": "123",  # 可以改成用户 ID
        "stream": False,
        "auto_save_history": True,
        "additional_messages": [{
            "content": prompt,
            "content_type": "text",
            "role": "user",
            "type": "question"
        }]
    }

    #print("Sending request to Coze:", url)
    #print("Payload:", payload)

    response = requests.post(url, headers=headers, json=payload)

    #print("Coze API Response Status Code:", response.status_code)
    #print("Coze API Response:", response.text)

    if response.status_code == 200:
        response_json = response.json()

        # 检查 API 是否返回错误
        if response_json.get("code") != 0:
            return f"Coze API Error: {response_json.get('msg')}"

        # 提取 AI 生成的回复
        conversation_status = response_json["data"]["status"]

        if not conversation_status == "in_progress":
            return "服务器不在线。"  # ✅ 确保返回字符串

        # 这里添加获取 AI 回复的逻辑
        ai_reply = get_coze_response(response_json['data']['conversation_id'], response_json['data']['id'])
        ai_follow_up = get_coze_follow_up(response_json['data']['conversation_id'], response_json['data']['id'])

        return {'ai_reply':ai_reply,'ai_follow_up':ai_follow_up}  # ✅ 返回 AI 生成的文本
    else:
        return f"Failed to chat with Coze API. Status code: {response.status_code}"
    
def get_coze_response(conversationID,chatID):
    print('获取主回复')
    import time;
    params = { "bot_id": bot_id,"task_id": chatID }
    getChatStatusUrl = url+f'/retrieve?conversation_id={conversationID}&chat_id={chatID}&'
    print('conversationID:'+conversationID)
    print('chatID:'+chatID)
    while True:
        response = requests.get(getChatStatusUrl, headers=headers, params=None)
        if response.status_code == 200:
            response_data = response.json()
            #print(f"response_data:\n{json.dumps(response_data,indent=4, ensure_ascii=False)}")
            status = response_data['data']['status']
            if status == 'completed':
                print(f"任务完成，状态: {status}")
                # 从响应中提取实际的应答内容
                getChatAnswerUrl = url+f'/message/list?chat_id={chatID}&conversation_id={conversationID}'
                response = requests.get(getChatAnswerUrl, headers=headers, params=params)
                if response.status_code == 200:
                    print("获取聊天记录成功,200")
                    #print(response.text)
                    response_json = response.json()
                    data = response_json.get("data", [])

                    if not isinstance(data, list):
                        return "Error: AI 返回了错误的数据格式。"

                # ✅ 遍历 messages，提取 `role: assistant` 且 `type: answer` 的 `content`
                    for message in data:
                        if isinstance(message,dict) and message.get("role") == "assistant" and message.get("type") == "answer":
                            return message.get("content", "无返回内容")
                break
            else:
                print(f"任务仍在处理中，状态: {status}")
                time.sleep(1)  # 等待5秒后再次检查
        else:
            print(f"请求失败，状态码: {response.status_code}")
            break
    return False
def get_coze_follow_up(conversationID,chatID):
    import time
    print('获取推荐的三个问题')
    params = { "bot_id": bot_id,"task_id": chatID }
    getChatStatusUrl = url+f'/retrieve?conversation_id={conversationID}&chat_id={chatID}&'
    follow_up = dict()
    n=0
    
    while True:
        response = requests.get(getChatStatusUrl, headers=headers, params=None)
        if response.status_code == 200:
            response_data = response.json()
            #print(f"response_data:\n{json.dumps(response_data,indent=4, ensure_ascii=False)}")
            status = response_data['data']['status']
            if status == 'completed':
                print(f"任务完成，状态: {status}")
                # 从响应中提取实际的应答内容
                getChatAnswerUrl = url+f'/message/list?chat_id={chatID}&conversation_id={conversationID}'
                response = requests.get(getChatAnswerUrl, headers=headers, params=params)
                if response.status_code == 200:
                    print("获取聊天记录成功,200")
                    #print(response.text)
                    response_json = response.json()
                    data = response_json.get("data", [])

                    if not isinstance(data, list):
                        return "Error: AI 返回了错误的数据格式。"

                # ✅ 遍历 messages，提取 `role: assistant` 且 `type: follow_up` 的 `content`
                    for message in data:
                        if isinstance(message,dict) and message.get("role") == "assistant" and message.get("type") == "follow_up":
                            n+=1
                            name = str(n)
                            follow_up[name] = message.get('content')
                            continue
                    return follow_up
                break
            else:
                print(f"任务仍在处理中，状态: {status}")
                time.sleep(1)  # 等待5秒后再次检查
        else:
            print(f"请求失败，状态码: {response.status_code}")
            break
    return False

'''
def chat_with_moonshot(prompt):
    # 调用 Moonshot API
    api_url = "https://api.moonshot.cn/v1/chat/completions"  
    api_key = "sk-ghjo6uesmh9FCF5yuPlNBxzblgMEXLH6KBDzPWvCDeD9Ko0Q" 
    payload = {
        "model": "moonshot-v1-8k",
        "messages": [{
            "role": "user",
            "content": f"{prompt}"
        }]
    }
    # 设置请求头
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

    print("Sending request to Moonshot:", api_url)
    print("Payload:", payload)

    response = requests.post(api_url, json=payload, headers=headers)

    print("Moonshot API Response Status Code:", response.status_code)
    print("Moonshot API Response Content:", response.text)

    if response.status_code == 200:
        response_json = response.json()
        message_content = response_json.get("choices", [{}])[0].get("message", {}).get("content", "")
        if not message_content:
            return {"error": "Moonshot API 返回了空内容"}
        return message_content  # ✅ 确保返回字符串
    else:
        return {"error": f"Failed to chat with Moonshot API. Status code: {response.status_code}"}'''

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5003)


    