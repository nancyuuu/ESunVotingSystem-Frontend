<template>
  <div class="d-flex justify-content-center">
    <div>
      <button @click="openModal" class="btn mb-3 create">新增項目</button>

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
              <button @click="editVoteItem(item.id)" class="btn btn-primary">
                編輯
              </button>
              <button @click="deleteVoteItem(item.id)" class="btn btn-danger">
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal（新增投票項目的表單） -->
  <div
    class="modal"
    tabindex="-1"
    v-show="isModalOpen"
    @click.self="closeModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">新增投票項目</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitNewVoteItem">
            <div class="mb-3">
              <label for="itemName" class="form-label">項目名稱</label>
              <input
                type="text"
                id="itemName"
                class="form-control"
                v-model="newVoteItem.itemName"
                required
              />
            </div>
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary">新增</button>
              <button
                type="button"
                class="btn btn-secondary ms-2"
                @click="closeModal"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";

const voteItems = ref([]);
const isModalOpen = ref(false); // 控制 Modal 顯示與否
const newVoteItem = ref({ itemName: "" }); // 新增投票項目的資料

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

const editVoteItem = (id) => {
  // 實現編輯功能
};

const deleteVoteItem = async (id) => {
  try {
    await axiosapi.delete("/voteItem/{itemId}");
    fetchVoteItems(); // 重新加載投票項目列表
  } catch (error) {
    console.error("Error deleting vote item:", error);
  }
};

// 開啟 Modal
const openModal = () => {
  isModalOpen.value = true;
};

// 關閉 Modal
const closeModal = () => {
  isModalOpen.value = false;
  newVoteItem.value.itemName = ""; // 重置表單資料
};

// 提交新增投票項目
const submitNewVoteItem = async () => {
  try {
    await axiosapi.post("/voteItem", newVoteItem.value);
    fetchVoteItems(); // 重新加載投票項目列表
    closeModal(); // 關閉 Modal
  } catch (error) {
    console.error("Error adding vote item:", error);
  }
};


onMounted(() => {
  fetchVoteItems();
});
</script>

<style>
.d-flex {
  margin-top: 40px;
  /* 調整這裡的數值，讓表格往下移 */
}

table th,
td {
  text-align: center;
}


button {
  margin: 0 5px;
}

.create {
  background-color: #03b3ad;
  color: white;
}

.create:hover {
  background-color: #019d98;
  color: white;
}





/* 使Modal背景顯示在畫面中央 */
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.modal-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 調整表單的樣式 */
.modal-body {
  padding: 20px;
}
</style>
