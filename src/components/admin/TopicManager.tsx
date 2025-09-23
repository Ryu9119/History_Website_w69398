import React from 'react';

export interface TopicManagerProps {
  topics: string[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
}

const TopicManager: React.FC<TopicManagerProps> = ({ topics, onAdd, onRemove }) => {
  const [value, setValue] = React.useState('');
  return (
    <div className="border rounded p-3">
      <div className="font-medium mb-2">Chủ đề</div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1"
          placeholder="Thêm chủ đề"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              onAdd(value.trim());
              setValue('');
            }
          }}
        />
        <button className="px-3 py-1 border rounded" onClick={() => { if (value.trim()) { onAdd(value.trim()); setValue(''); } }}>Thêm</button>
      </div>
      <ul className="space-y-1">
        {topics.map(t => (
          <li key={t} className="flex items-center justify-between">
            <span>{t}</span>
            <button className="px-2 py-0.5 border rounded text-red-600" onClick={() => onRemove(t)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicManager;


