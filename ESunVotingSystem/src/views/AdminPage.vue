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
            <td>{{ item.id }}</td>
            <td>{{ item.itemName }}</td>
            <td>
              <button @click="openEditModal(item)" class="btn btn-primary">
                編輯
              </button>
              <button @click="openDeleteModal(item.id)" class="btn btn-danger">
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

  <!-- Modal（編輯名稱功能） -->
  <div
    class="modal"
    tabindex="-1"
    v-show="isEditModalOpen"
    @click.self="closeEditModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">編輯名稱</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeEditModal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitEditVoteItem">
            <div class="mb-3">
              <label for="editItemName" class="form-label">項目名稱</label>
              <input
                type="text"
                id="editItemName"
                class="form-control"
                v-model="editVoteItem.itemName"
                required
              />
            </div>
            <div class="d-flex justify-content-end">
              <button type="submit" class="btn btn-primary">儲存</button>
              <button
                type="button"
                class="btn btn-secondary ms-2"
                @click="closeEditModal"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <div>
    <!-- 刪除確認功能 -->
    <div
      v-if="isDeleteModalOpen"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">確認刪除</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeDeleteModal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>您確定要刪除此項目嗎？</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              是
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeDeleteModal"
            >
              否
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isDeleteModalOpen" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosapi from "@/plugins/axios.js";

const voteItems = ref([]);
const isModalOpen = ref(false); // 控制 Modal 顯示
const isEditModalOpen = ref(false); // 控制編輯模態框顯示
const newVoteItem = ref({ itemName: "" }); // 新增投票項目的資料
const editVoteItem = ref({ id: null, itemName: "" }); // 編輯投票項目的資料
const isDeleteModalOpen = ref(false);
const deleteItemId = ref(null);

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

// 編輯模態框相關操作
const openEditModal = (item) => {
  isEditModalOpen.value = true;
  editVoteItem.value = { ...item }; // 將要編輯的資料帶入表單
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editVoteItem.value = { id: null, itemName: "" }; // 重置編輯資料
};

// 更新資料方法，傳入完整的 DAO
const updateVoteItem = async (data) => {
  try {
    const response = await axiosapi.put("/voteItem", data);
    console.log("編輯成功", response.data);
  } catch (error) {
    console.error("編輯失敗", error);
  }
};

const submitEditVoteItem = async () => {
  try {
    // 調用 updateVoteItem，傳入完整的編輯資料
    await updateVoteItem(editVoteItem.value);
    fetchVoteItems(); // 重新加載列表
    closeEditModal(); // 關閉模態框
  } catch (error) {
    console.error("Error editing vote item:", error);
  }
};

const openDeleteModal = (id) => {
  isDeleteModalOpen.value = true;
  deleteItemId.value = id; // 設定要刪除的項目 ID
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  deleteItemId.value = null; // 清除要刪除的項目 ID
};

const confirmDelete = async () => {
  if (deleteItemId.value === null) return;
  try {
    await axiosapi.delete(`/voteItem/${deleteItemId.value}`);
    console.log("刪除成功");
    fetchVoteItems(); // 重新加載列表
    closeDeleteModal(); // 關閉小視窗
  } catch (error) {
    console.error("刪除失敗", error);
  }
};

onMounted(() => {
  fetchVoteItems();
});
</script>

<style>
.d-flex {
  margin-top: 40px;
  /* 讓表格往下移 */
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

/* 使Modal顯示在畫面中央 */
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
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1049;
}
</style>
