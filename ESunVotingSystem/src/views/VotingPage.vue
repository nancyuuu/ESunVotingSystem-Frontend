<template>
    <div class="d-flex justify-content-center">
      <div>
        <table class="table">
          <thead>
            <tr>
              <th>編號</th>
              <th>項目名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in voteItems" :key="item.id">
              <!-- 使用資料庫中的 id -->
              <td>{{ item.id }}</td>
              <td>{{ item.itemName }}</td>
              <td>
                <button >
                  投票
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import axiosapi from "@/plugins/axios.js";
  
  const voteItems = ref([]);
  
  const fetchVoteItems = async () => {
    try {
      const response = await axiosapi.get("/voteItem");
      // 檢查回應結構
      if (response && response.data) {
        voteItems.value = response.data.contents;
        console.log(response.data.contents);
      } else {
        console.error("回應結構錯誤或資料缺失", response);
      }
    } catch (error) {
      console.error("Error fetching vote items:", error);
    }
  };
  
  onMounted(() => {
    fetchVoteItems();
  });
  </script>
  
  <style>
  .d-flex {
    margin-top: 40px; /* 調整這裡的數值，讓表格往下移 */
  }
  
  table th,
  td {
    text-align: center;
  }
  
  </style>
