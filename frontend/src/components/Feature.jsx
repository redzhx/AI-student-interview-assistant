import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // 导入 Bootstrap 样式


const FeatureSection = () => {
  return (
    <div className="py-md-5">
     
      <div className="container mt-5">
        <div className="row mt-5">
          <div className=" text-center col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div className="card border-1 bg-white text-center p-1">
              <div className="card-header text-center bg-white border-0 pb-0">
                <div className="icon text-lg text-primary mb-4">
                <i class="fa-regular fa-paper-plane fa-3x"></i>
                </div>
                <h2 className="h3 text-dark m-0">随时练习</h2>
              </div>
              <div className="card-body">
                <p>时空自由，日拱一卒，面试无忧。</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4 mb-4 mb-lg-0">
            <div className="card border-1 bg-white text-center p-1">
            <div className="card-header text-center bg-white border-0 pb-0">
            <div className="icon text-lg text-primary mb-4">
            <i class="fa-regular fa-thumbs-up fa-3x"></i>
                </div>
                <h2 className="h3 text-dark m-0">真题模拟</h2>
              </div>
              <div className="card-body">
                <p>真题结合AI大模型，题目更靠谱。</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-1 bg-white text-center p-1">
            <div className="card-header text-center bg-white border-0 pb-0">
            <div className="icon text-lg text-primary mb-4">
                <i class="fa-solid fa-robot fa-3x"></i>
                </div>
                <h2 className="h4 text-dark m-0">智能反馈</h2>
              </div>
              <div className="card-body">
                <p>个性化智能评价，拒绝千篇一律。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-center py-md-5">
        <div className="col-12 col-lg-8 text-center">
          <h2 className="h1 mt-5 mb-5">助你面试无畏，成就未来之星！</h2>
          <p>无论是准备自招面试，还是日常练习思辨能力，面小狮都是你的理想助手。让面小狮陪你一同开启升学之旅，成就未来的梦想！</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
