<template>
  <div class="d-flex justify-content-center">
    <div>
      <table class="table">
        <thead>
          <tr>
            <th>編號</th>
            <th>項目名稱</th>
            <th>累積票數</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in voteItems" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.itemName }}</td>
            <td>{{ item.voteNum || 0 }}</td> 
            <td>
              <button @click="openVoteModal(item)">投票</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 投票小視窗 -->
  <div v-if="showVoteModal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">填寫投票人姓名</h5>
          <button type="button" class="close" @click="closeVoteModal">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <input
            type="text"
            v-model="voterName"
            placeholder="請輸入姓名"
            class="form-control"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="submitVote">
            投票
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeVoteModal"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";

const voteItems = ref([]);
const showVoteModal = ref(false); // 控制顯示小視窗
const currentItem = ref(null); // 儲存當前投票的項目
const voterName = ref(""); // 儲存投票人姓名
const voteResults = ref([]);

const fetchVoteItems = async () => {
  try {
    // 先獲取投票項目
    const voteItemsResponse = await axiosapi.get("/voteItem");
    if (voteItemsResponse && voteItemsResponse.data) {
      voteItems.value = voteItemsResponse.data.contents;
    } else {
      console.error("未獲取到投票項目資料");
    }

    // 獲取投票結果
    const voteResultsResponse = await axiosapi.get("/voteRecord");
    if (voteResultsResponse && voteResultsResponse.data) {
      voteResults.value = voteResultsResponse.data.contents;

      // 合併投票結果到投票項目
      voteItems.value = voteItems.value.map(item => {
        // 查找該項目的投票結果
        const voteResult = voteResults.value.find(result => result.id === item.id);
        // 如果找到了對應的投票結果，將票數加到 item 中
        if (voteResult) {
          item.voteNum = voteResult.voteNum;
        } else {
          item.voteNum = 0; // 如果沒有對應的投票結果，設置為 0
        }
        return item;
      });
    } else {
      console.error("未獲取到投票結果資料");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


// 顯示投票小視窗
const openVoteModal = (item) => {
  currentItem.value = item;
  showVoteModal.value = true;
};

// 關閉投票小視窗
const closeVoteModal = () => {
  showVoteModal.value = false;
  voterName.value = ""; // 清空姓名輸入框
};

// 提交投票
const submitVote = async () => {
  if (!voterName.value) {
    alert("請輸入姓名！");
    return;
  }

  try {
    // 建立要傳到後端的 VoteRecordsDao 物件
    const voteRecord = {

      voteItem: currentItem.value.id,
      voterName: voterName.value,
    };
    console.log(voteRecord);

    // 發送投票資料給後端
    const response = await axiosapi.post("/voteRecord", voteRecord);

    if (response.data.result_type) {
      alert("投票成功！");
      fetchVoteItems();
      closeVoteModal(); // 關閉小視窗
    } else {
      alert("投票失敗，請稍後再試！");
    }
  } catch (error) {
    console.error("Error submitting vote:", error);
    alert("投票提交失敗！");
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

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.modal-dialog {
  max-width: 400px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
}

.modal-header,
.modal-footer {
  padding: 10px;
}

.close {
  margin-left: 170px;
  font-size: 25px;
  cursor: pointer;
  background-color: white;
  color: gray;
}
</style>
