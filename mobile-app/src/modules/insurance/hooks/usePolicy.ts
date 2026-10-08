import { useInsuranceStore } from '../store/insuranceSlice';

export function usePolicy() {
  const members = useInsuranceStore((s) => s.members);
  const nominee = useInsuranceStore((s) => s.nominee);
  const addMember = useInsuranceStore((s) => s.addMember);
  const updateMember = useInsuranceStore((s) => s.updateMember);
  const removeMember = useInsuranceStore((s) => s.removeMember);
  const setNominee = useInsuranceStore((s) => s.setNominee);

  return { members, nominee, addMember, updateMember, removeMember, setNominee };
}
