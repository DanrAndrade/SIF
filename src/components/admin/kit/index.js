// Kit de componentes padrão do painel administrativo.
// Toda tela nova (e as existentes, aos poucos) deve usar estes blocos para
// manter o mesmo layout, posição de botões e comportamento.
export { default as AdminPage, AdminCard, SaveButton, SaveStatus, SecondaryButton, PrimaryButton } from './AdminPage';
export { default as ItemActions, moveItem } from './ItemActions';
export { default as ImageField } from './ImageField';
export { ConfirmProvider, useConfirm } from './ConfirmDialog';
export { UnsavedGuardProvider, useUnsavedGuard, useCanLeave } from './UnsavedGuard';
export { default as useDirty } from './useDirty';
export { default as Field } from './Field';
