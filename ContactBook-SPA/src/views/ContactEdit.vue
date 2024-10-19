<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuery, useMutation, QueryClient } from '@tanstack/vue-query';
import ContactForm from '@/components/ContactForm.vue';
import contactsService from '@/services/contacts.service';
const props = defineProps({
  contactId: { type: String, required: true }
});
const router = useRouter();
const route = useRoute();
const message = ref('');
const queryClient = new QueryClient();

const {
  data: ContactData,
  error,
  isLoading
} = useQuery({
  queryKey: ['contact', props.contactId],
  queryFn: () => contactsService.fetchContact(props.contactId),
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

const contact = computed(() => ContactData?.value);

const updateContactMutation = useMutation({
  mutationFn: (contact) => contactsService.updateContact(props.contactId, contact),
  onSuccess: (data) => {
    contact.value = data.value;
    message.value = 'Cập nhật thành công';
  },
  onError: (error) => {
    console.log(error);
    message.value = 'Cập nhật thất bại';
  }
});

const deleteContactMutation = useMutation({
  mutationFn: (id) => contactsService.deleteContact(id),
  onSuccess: () => {
    queryClient.invalidateQueries(['contacts']);
    router.push({ name: 'contactbook' });
  },
  onError: (error) => {
    console.log(error);
    message.value = 'Xóa thất bại';
  }
});

function getContact() {
  return contact;
}

async function onUpdateContact(contact) {
  updateContactMutation.mutate(contact);
}
async function onDeleteContact(id) {
  if (confirm('Bạn muốn xóa Liên hệ này?')) {
    deleteContactMutation.mutate(id);
  }
}
getContact();
</script>
<template>
  <div v-if="isLoading" class="page"></div>
  <div v-if="error" class="page">
    <h4>Không tìm thấy Liên hệ</h4>
  </div>
  <div v-if="contact" class="page">
    <h4>Hiệu chỉnh Liên hệ</h4>
    <ContactForm
      :contact="contact"
      @submit:contact="onUpdateContact"
      @delete:contact="onDeleteContact"
    />
    <p>{{ message }}</p>
  </div>
</template>
