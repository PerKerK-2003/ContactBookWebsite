<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import ContactForm from '@/components/ContactForm.vue';
import ContactBook from './ContactBook.vue';
import contactsService from '@/services/contacts.service';
import { useQuery, useMutation, QueryClient } from '@tanstack/vue-query';

const router = useRouter();
const route = useRoute();
const message = ref('');
const queryClient = new QueryClient();
const {
  data: contactData,
  error,
  isLoading
} = useQuery({
  queryKey: ['contact'],
  queryFn: contactsService.fetchContacts,
  onSuccess: (data) => {
    contact.value = data.value;
  },
  onError: (error) => {
    console.log(error);
    router.push({
      name: 'notfound',
      params: { pathMatch: route.path.split('/').slice(1) },
      query: route.query,
      hash: route.hash
    });
  }
});

const contact = computed(() => contactData?.value);

const AddContactMutation = useMutation({
  mutationFn: (contact) => contactsService.createContact(contact),
  onSuccess: (data) => {
    queryClient.invalidateQueries(['contacts'], data);
    message.value = 'Liên hệ được thêm thành công.';
    queryClient.invalidateQueries(['contacts']);
  },
  onError: (error) => {
    console.log(error);
    message.value = 'Thêm liên hệ thất bại.';
  }
});

function getContact() {
  return contact;
}

function onAddContact(contact) {
  AddContactMutation.mutate(contact);
  ContactBook.refetch();
}

getContact();
</script>
<template>
  <div v-if="isLoading" class="page">Đang tải dữ liệu...</div>
  <div v-if="error" class="page">Lỗi: {{ error.message }}</div>
  <div v-if="contact" class="page">
    <h4>Thêm Liên hệ</h4>
    <div class="p-1">Ảnh đại diện</div>
    <ContactForm :contact="contact" @submit:contact="onAddContact" />
    <p>{{ message }}</p>
  </div>
</template>
