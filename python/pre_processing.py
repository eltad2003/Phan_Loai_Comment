import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
import joblib
from pyvi import ViTokenizer

# Đọc file CSV
df = pd.read_csv("VI_IMDB.csv")

# Mã hóa nhãn: positive -> 1, negative -> 0
df['label'] = df['sentiment'].map({'positive': 1, 'negative': 0})

# Hàm tiền xử lý từng comment
def preprocess_text(text):
    text = re.sub(r'<.*?>', ' ', str(text))  # Xoá thẻ HTML
    text = re.sub(r'[^a-zA-ZÀ-ỹ0-9\s]', ' ', text)  # Xoá ký tự đặc biệt
    text = text.lower()  # Chuyển về chữ thường
    text = re.sub(r'\s+', ' ', text).strip()  # Xoá khoảng trắng thừa
    text = ViTokenizer.tokenize(text)
    return text


# Tiền xử lý văn bản
df['cleaned_review'] = df['vi_review'].apply(preprocess_text)

# Xuất file sau tiền xử lý
df[['cleaned_review', 'label']].to_csv("cleaned_comments.csv", index=False)

# Vector hóa văn bản bằng TF-IDF
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df['cleaned_review'])
joblib.dump(vectorizer, "tfidf_vectorizer.pkl")

# Chuyển thành DataFrame
vector_df = pd.DataFrame(
    X.toarray(), columns=vectorizer.get_feature_names_out())

# Thêm cột label vào DataFrame vector
vector_df['label'] = df['label'].values

# Xuất file sau khi vector hóa
vector_df.to_csv("vectorized_comments.csv", index=False)

# Xem vài dòng đầu
print(df[['cleaned_review', 'label']].head())
print(vector_df.head())
