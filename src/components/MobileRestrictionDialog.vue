<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useMobileRestriction } from '@/composables/useMobileRestriction'

const { showRestrictionDialog, closeDialog } = useMobileRestriction()

const handleClose = () => {
  closeDialog()
}

const preventClose = (e: Event) => {
  e.preventDefault()
}
</script>

<template>
  <Dialog :open="showRestrictionDialog">
    <DialogContent
      class="sm:max-w-[425px] [&>button]:hidden"
      @pointer-down-outside="preventClose"
      @escape-key-down="preventClose"
      @interact-outside="preventClose"
    >
      <DialogHeader>
        <DialogTitle>Desktop Only Feature</DialogTitle>
        <DialogDescription>
          This feature is currently optimized for desktop use only. Please switch to a desktop device.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button @click="handleClose">I Understand</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
