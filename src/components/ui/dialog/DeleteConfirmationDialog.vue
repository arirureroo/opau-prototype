<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

/**
 * Reusable confirmation dialog for delete operations
 */
defineProps<{
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title || 'Confirm Delete' }}</DialogTitle>
        <DialogDescription>
          {{ description || 'Are you sure you want to delete this item? This action cannot be undone.' }}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" @click="emit('cancel')">
          Cancel
        </Button>
        <Button variant="destructive" @click="emit('confirm')">
          {{ confirmLabel || 'Delete' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
