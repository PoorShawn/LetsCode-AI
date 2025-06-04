import json
from flask import Flask, jsonify, request
import requests 
from flask_cors import CORS 
bot_id = '7512129992533557289'

url = "https://api.coze.cn/v3/chat"
s_token = "pat_CTlVXm3toVYeJT8OC0QPK8B5hNbRFGxvYS84gC4rzKw1irGpatdZnIbmSpkgHVB6"  # ✅ 确保使用最新的 Personal Access Token
headers = {
        "Authorization": f"Bearer {s_token}",
        "Content-Type": "application/json"
    }

app = Flask(__name__)
# 启用跨域请求支持
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/api/database', methods=['POST'])

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
        chat_response = chat_with_coze(prompt)

        '''
        # 确保 chat_response 是str
        if isinstance(chat_reply, dict) and "error" in chat_reply:
            return jsonify({"error": chat_reply["error"]}), 500
        
        if not isinstance(chat_reply, str):
            print("Error: chat_reply did not return a string.")
            return jsonify({"error": "AI 响应格式错误"}), 500
        '''
        print('chat_response:',chat_response)
        return jsonify({"message": 'ok'})  # ✅ 确保返回 JSON


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

    print("Sending request to Coze:", url)
    print("Payload:", payload)
    response = requests.post(url, headers=headers, json=payload)
    response_json = response.json()
    conversationID = response_json['data']['conversation_id']
    print("conversationID:"+conversationID)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5003)


    