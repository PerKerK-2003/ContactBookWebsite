<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import ContactCard from '@/components/ContactCard.vue';
import InputSearch from '@/components/InputSearch.vue';
import ContactList from '@/components/ContactList.vue';
import MainPagination from '@/components/MainPagination.vue';
import contactsService from '@/services/contacts.service';
// The full code will be presented below
const router = useRouter();
const route = useRoute();
const queryClient = useQueryClient();
// current page is from the query string (?page=1)
const currentPage = computed(() => {
  const page = Number(route.query?.page);
  if (Number.isNaN(page) || page < 1) return 1;
  return page;
});
const selectedIndex = ref(-1);
const searchText = ref('');
// Get contacts for a specific pages and order them by name

const {
  data: ContactData,
  error,
  isLoading,
  refetch
} = useQuery({
  queryKey: ['contacts', currentPage.value],
  queryFn: () => contactsService.fetchContacts(currentPage.value),
  keepPreviousData: true,
  staleTime: 5000,
  onSuccess: (data) => {
    totalPages.value = data.metadata.lastPage;
    selectedIndex.value = -1;
  }
});
const totalPages = computed(() => ContactData?.value?.metadata?.lastPage ?? 1);
const contacts = computed(() => ContactData?.value?.contacts ?? []);

// Map each contact to a string for searching
const searchableContacts = computed(() =>
  contacts.value.map((contact) => {
    const { name, email, address, phone } = contact;
    return [name, email, address, phone].join('');
  })
);
// Contacts filtered by searchText
const filteredContacts = computed(() => {
  if (!searchText.value) return contacts.value;
  return contacts.value.filter((contact, index) =>
    searchableContacts.value[index].includes(searchText.value)
  );
});
const selectedContact = computed(() => {
  if (selectedIndex.value < 0) return null;
  return filteredContacts.value[selectedIndex.value];
});

const deleteALlContactsMutation = useMutation({
  mutationFn: contactsService.deleteAllContacts,
  onSuccess: () => {
    queryClient.invalidateQueries(['contacts']);
  }
});
// Handle delete all contacts event
async function onDeleteContacts() {
  if (confirm('Bạn muốn xóa tất cả Liên hệ?')) {
    deleteALlContactsMutation.mutate();
  }
}
function goToAddContact() {
  router.push({ name: 'contact.add' });
}
function changeCurrentPage(page) {
  router.push({ name: 'contactbook', query: { page } });
}
// Whenever searchText changes, reset selectedIndex
watch(searchText, () => (selectedIndex.value = -1));
// or watchEffect(() => (selectedIndex.value = -1));
// When currentPage changes, fetch contacts for currentPage
watch(currentPage, () => refetch());
</script>

<template>
  <div class="page row mb-5">
    <div class="mt-3 col-md-6">
      <h4>
        Danh bạ
        <i class="fas fa-address-book"></i>
      </h4>
      <div class="my-3">
        <InputSearch v-model="searchText" />
      </div>
      <div v-if="isLoading" class="text-info">Đang tải dữ liệu...</div>
      <div v-if="error" class="text-danger">Lỗi: {{ error.message }}</div>
      <ContactList
        v-if="filteredContacts.length > 0"
        :contacts="filteredContacts"
        v-model:selected-index="selectedIndex"
      />
      <p v-else>Không có liên hệ nào.</p>
      <div class="mt-3 d-flex flex-wrap justify-content-round align-items-center">
        <MainPagination
          :total-pages="totalPages"
          :current-page="currentPage"
          @update:current-page="changeCurrentPage"
        />
        <div class="w-100"></div>
        <button class="btn btn-sm btn-primary" @click="refetch">
          <i class="fas fa-redo"></i> Làm mới
        </button>
        <button class="btn btn-sm btn-success" @click="goToAddContact">
          <i class="fas fa-plus"></i> Thêm mới
        </button>
        <button class="btn btn-sm btn-danger" @click="onDeleteContacts">
          <i class="fas fa-trash"></i> Xóa tất cả
        </button>
      </div>
    </div>
    <div class="mt-3 col-md-6">
      <div v-if="selectedContact">
        <h4>
          Chi tiết Liên hệ
          <i class="fas fa-address-card"></i>
        </h4>
        <ContactCard :contact="selectedContact" />
        <router-link
          :to="{
            name: 'contact.edit',
            params: { id: selectedContact.id }
          }"
        >
          <span class="mt-2 badge text-bg-warning"> <i class="fas fa-edit"></i> Hiệu chỉnh</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page {
  text-align: left;
  max-width: 750px;
}
</style>
