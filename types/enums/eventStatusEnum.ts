import { RequestStatusEnum } from 'src/types/generated/generated.types';

export const requestStatusEnumData = {
  [RequestStatusEnum.Unknown]: { color: '', icon: '' },
  [RequestStatusEnum.Pending]: { color: '#efa584', icon: 'pending', },
  [RequestStatusEnum.Approved]: { color: '#6fb265', icon: 'check_circle', },
  [RequestStatusEnum.Rejected]: { color: '#ad1f1f', icon: 'cancel', },
}
