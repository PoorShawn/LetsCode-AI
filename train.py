from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# ✅ 使用轻量模型，适合 macOS + CPU
model_name = "Salesforce/codegen-350M-multi"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# ✅ 设置 pad_token，防止报错
if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
model.config.pad_token_id = tokenizer.eos_token_id

# ✅ 输入你的 prompt
prompt = "def hello_world():"

# ✅ 编码 + attention_mask 设置
inputs = tokenizer(prompt, return_tensors="pt", padding=True)
inputs["attention_mask"] = torch.ones_like(inputs["input_ids"])

# ✅ 禁用 GPU，强制用 CPU
model = model.cpu()

# ✅ 生成
with torch.no_grad():
    outputs = model.generate(
        inputs["input_ids"],
        attention_mask=inputs["attention_mask"],
        max_length=50,
        pad_token_id=tokenizer.eos_token_id
    )

# ✅ 解码
print(tokenizer.decode(outputs[0], skip_special_tokens=True))