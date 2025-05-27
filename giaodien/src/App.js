import { useState } from 'react';

function App() {
  const [comment, setComment] = useState('')
  const [results, setResults] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleComment = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment })
      });
      if (!response.ok) {
        alert('Lỗi kết nối API')
        setComment('')
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResults(data)
    } catch (error) {
      console.log("Lỗi kết nối server ", error);
      alert('Lỗi kết nối đến server!')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setComment('')
    setResults('')
  }

  return (
    <div className="min-vh-100 " style={{ background: 'linear-gradient(135deg,rgb(141, 160, 244) 0%, #764ba2 100%)' }}>
      <div className="container py-5">

        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-white mb-3">
            <i className="bi bi-chat-text me-3"></i>
            Phân tích Bình luận
          </h1>

        </div>


        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card shadow-lg border-0 h-100" >
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i>
                  Nhập bình luận
                </h5>
              </div>
              <div className="card-body p-4">
                <div className="mb-3">
                  <h3 className="fw-bold text-dark mb-3">
                    Nội dung bình luận:
                  </h3>
                  <textarea
                    className="form-control form-control-lg"
                    rows="8"
                    placeholder="Nhập bình luận cần phân tích..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}

                  />

                  <div className="form-text">
                    <p className="text-muted">
                      Số ký tự: {comment.length}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-lg border-0 h-100" >
              <div className="card-header bg-success text-white py-3">
                <h5 className="mb-0">
                  <i className="bi bi-graph-up me-2"></i>
                  Kết quả phân tích
                </h5>
              </div>
              <div className="card-body p-4 d-flex align-items-center justify-content-center">
                {isLoading ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted fs-5">Đang phân tích bình luận...</p>
                  </div>
                ) : results ? (
                  <div className="text-center">
                    <div className="alert alert-info border-0 shadow-sm mb-0" style={{ borderRadius: '12px' }}>
                      {results.prediction === 1 ? (
                        <>
                          <i className="bi bi-check-circle-fill fs-4 text-success mb-2 d-block"></i>
                          <p className="mb-0 fs-5 fw-semibold">Bình luận tích cực</p>
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle-fill fs-4 text-danger mb-2 d-block"></i>
                          <p className="mb-0 fs-5 fw-semibold">Bình luận tiêu cực</p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted">
                    <i className="bi bi-chat-dots fs-1 mb-3 d-block opacity-50"></i>
                    <p className="fs-5">Kết quả phân tích sẽ hiển thị tại đây</p>
                    <p className="p">Nhập bình luận và nhấn "Phân tích" để bắt đầu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-primary btn-lg px-5 py-3 shadow-lg"
            onClick={handleComment}
            disabled={isLoading || !comment.trim()}
            style={{ borderRadius: '50px', minWidth: '180px' }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Đang phân tích...
              </>
            ) : (
              <>
                <i className="bi bi-play-fill me-2"></i>
                Phân tích
              </>
            )}
          </button>

          <button
            className="btn btn-outline-light btn-lg px-4 py-3 shadow-lg"
            onClick={handleClear}
            disabled={isLoading}
            style={{ borderRadius: '50px', minWidth: '120px' }}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Làm mới
          </button>
        </div>


      </div>

    </div>
  )
}

export default App;