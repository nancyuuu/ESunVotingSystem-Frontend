<template>
  <div class="container">
    <button @click="goToVoting">前往投票介面</button>
    <button  @click="goToAdmin">前往管理後台</button>
  </div>
</template>
<div></div>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToVoting = () => {
  router.push('/voting'); // 假設 '/voting' 是投票介面的路由
};

const goToAdmin = () => {
  router.push('/admin'); // 假設 '/admin' 是管理後台的路由
};
</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh; /* 將高度設為視窗高度，確保內容在垂直方向居中 */
  }

  button {
    margin: 0 40px; /* 增加按鈕間的間距 */
    padding: 10px 20px;
    background-color:#03b3ad;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #019d98;
  }
</style>
