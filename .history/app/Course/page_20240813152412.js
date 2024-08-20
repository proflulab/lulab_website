// "use client";
// import { Grid, Typography, useMediaQuery } from "@mui/material";
// import React, { useEffect } from "react";
// import App from "../title/page";
// import End from "../title/end";

// const Course = () => {
//   useEffect(() => {
//     // 动态添加 Stripe Buy Button 脚本
//     const script = document.createElement("script");
//     script.src = "https://js.stripe.com/v3/buy-button.js";
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       // 在组件卸载时移除脚本
//       document.body.removeChild(script);
//     };
//   }, []); // 依赖项为空数组表示只在组件加载时运行一次

//   const isSmallerScreen = useMediaQuery("(max-width: 600px)");

//   return (
//     <>
//       <App />
//       <Grid
//         sx={{
//           backgroundColor: "white",
//           minHeight: "500px",
//           display: "flex",
//           flexDirection: isSmallerScreen ? "column" : "row",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         {isSmallerScreen ? (
//           <>
//             <Grid item xs={12} md={4}>
//               {/* Stripe Buy Button code */}
//               <stripe-buy-button
//                 buy-button-id="buy_btn_1OjCnoEmgDIszJrI1w8Hs6zU"
//                 publishable-key="pk_test_51OgaIMEmgDIszJrIVQpseWGGIsUJNLBa7o9pdwMxzzq3oS39E79hItBKN9GuUuSbBBxcwsxwPGUy7NBcbgqDCssZ005iAmw0YI"
//               ></stripe-buy-button>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   color: "black",
//                   textAlign: "center",
//                   fontSize: { xs: "16px", md: "20px" },
//                 }}
//               >
//                 Tsinghua Professor Lu Xiangqian <br />
//                 Family Education & Career Development planning <br />
//                 <span style={{ color: "green" }}>
//                   Includes 1 to 1 consultation and Q&A
//                 </span>
//                 <br />
//                 Train children into <br />
//                 Stanford Berkeley <br />
//                 Instruct multiple participants to join <br />
//                 Or start a unicorn company
//               </Typography>
//             </Grid>
//           </>
//         ) : (
//           <>
//             <Grid item xs={12} md={4}>
//               {/* Stripe Buy Button code */}
//               <stripe-buy-button
//                 buy-button-id="buy_btn_1OjCnoEmgDIszJrI1w8Hs6zU"
//                 publishable-key="pk_test_51OgaIMEmgDIszJrIVQpseWGGIsUJNLBa7o9pdwMxzzq3oS39E79hItBKN9GuUuSbBBxcwsxwPGUy7NBcbgqDCssZ005iAmw0YI"
//               ></stripe-buy-button>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   color: "black",
//                   textAlign: "center",
//                   fontSize: { xs: "16px", md: "20px" },
//                 }}
//               >
//                 Tsinghua Professor Lu Xiangqian <br />
//                 Family Education & Career Development planning <br />
//                 <span style={{ color: "green" }}>
//                   Includes 1 to 1 consultation and Q&A
//                 </span>
//                 <br />
//                 Train children into <br />
//                 Stanford Berkeley <br />
//                 Instruct multiple participants to join <br />
//                 Or start a unicorn company
//               </Typography>
//             </Grid>
//           </>
//         )}
//       </Grid>
//       <End />
//     </>
//   );
// };

// export default Course;
// pages/product.js
import React from "react";

const ProductPage = ({ product }) => {
  return (
    <div>
      <h1>{product.goods_name}</h1>
      <img src={product.goods_img[0]} alt={product.goods_name} />
      <p>{product.goods_detail_text}</p>
      <h2>价格: ¥{product.sku[0].sku_price / 100}</h2>
      <p>库存: {product.extend.stock}</p>
      <p>已售: {product.extend.sell_num}</p>
    </div>
  );
};

export async function getServerSideProps() {
  const res = await fetch(
    "https://api.xiaoe-tech.com/xe.goods.detail.get/4.0.0"
  );
  const data = await res.json();

  return {
    props: {
      product: data[0] || null, // 假设 data 是一个包含单个商品详情的数组
    },
  };
}

export default ProductPage;
