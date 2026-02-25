import React from 'react';
import { useRecordStore } from '../../src/store/recordStore';
import RecordForm from '../../src/components/RecordForm';
import { RecordFormData } from '../../src/types';

export default function NewRecordScreen() {
  const add = useRecordStore((s) => s.add);

  const handleSave = async (data: RecordFormData) => {
    await add(data);
  };

  return <RecordForm title="新增记录" onSave={handleSave} />;
}
