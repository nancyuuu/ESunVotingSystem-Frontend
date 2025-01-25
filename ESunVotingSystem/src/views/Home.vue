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
  router.push('/voting'); // 投票介面
};

const goToAdmin = () => {
  router.push('/admin'); // 管理後台
};
</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh; /* 內容在垂直方向居中 */
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
