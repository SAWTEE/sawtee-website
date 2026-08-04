import DangerButton from '@/components/Backend/DangerButton';
import InputError from '@/components/Backend/InputError';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DeleteUserForm({ className = '' }) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef();
  const { toast } = useToast();

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    password: '',
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser = e => {
    e.preventDefault();

    destroy(route('admin.profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: 'Password updated.',
          description: 'Your password has been updated.',
        });
        closeModal();
      },
      onError: () => passwordInput.current.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-lg font-medium text-secondary-foreground">
          Delete Account
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any
          data or information that you wish to retain.
        </p>
      </header>

      <DangerButton onClick={() => confirmUserDeletion()}>
        Delete Account
      </DangerButton>
      <Dialog open={confirmingUserDeletion} onOpenChange={() => closeModal()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account?
            </DialogDescription>
          </DialogHeader>
          <p className="mt-1 text-sm text-muted-foreground">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Please enter your password to confirm you would
            like to permanently delete your account.
          </p>
          <form onSubmit={deleteUser} className="dark:bg-bgDarker">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    //   className="mt-1 block w-3/4"
                    isFocused
                    placeholder="Password"
                    className="col-span-3"
                  />
                </div>
              </div>
              <InputError message={errors.password} className="mt-2" />
            </div>
          </form>
          <DialogFooter>
            <div className="mt-6 flex justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>

              <Button
                variant="destructive"
                type="submit"
                className="ms-3"
                disabled={processing}
              >
                Delete Account
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className="p-6 dark:bg-bgDarker">
          <h2 className="text-lg font-medium text-secondary-foreground">
            Are you sure you want to delete your account?
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Once your account is deleted, all of its resources and data will be
            permanently deleted. Please enter your password to confirm you would
            like to permanently delete your account.
          </p>

          <div className="mt-6">
            <InputLabel
              htmlFor="password"
              value="Password"
              className="sr-only"
            />

            <TextInput
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              className="mt-1 block w-3/4"
              isFocused
              placeholder="Password"
            />

            <InputError message={errors.password} className="mt-2" />
          </div>

          <div className="mt-6 flex justify-end">
            <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

            <DangerButton className="ms-3" disabled={processing}>
              Delete Account
            </DangerButton>
          </div>
        </form>
      </Modal> */}
    </section>
  );
}
