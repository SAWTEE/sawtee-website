// @ts-nocheck
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { useState } from 'react';
export function CustomFilter({ table = undefined, column = undefined }) {
  const [value, setValue] = useState(undefined);
  return (
    <Input
      placeholder={`Filter using ${column} field...`}
      value={value}
      onChange={event =>
        setValue(
          table
            .getColumn(column ? column : 'title')
            ?.setFilterValue(event.target.value)
        )
      }
      className="max-w-sm"
    />
  );
}

export function GlobalFilter({ globalFilter = undefined, setGlobalFilter = undefined }) {
  return (
    <Input
      placeholder="Filter using any column field..."
      value={globalFilter}
      onChange={event => setGlobalFilter(event.target.value.toString())}
      className="max-w-sm"
    />
  );
}

export function TypeFilter({ data = undefined, value = undefined, label = undefined, route = undefined }) {
  const [selectedType = null, setSelectedType] = useState(value);
  function handleTypeFilter(id) {
    setSelectedType(id);
    router.visit(route, {
      data: { category_id: id },
      preserveState: true,
    });
  }
  return (
    <Select
      onValueChange={value => {
        handleTypeFilter(value);
      }}
      value={value}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Filter using ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {data?.map(item => (
            <SelectItem key={item.id} value={item.id}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
