'use client';

import { CheckCircle, GraduationCap, Icon, PersonStanding, School2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { cn, titilize } from "utils";
import { Button, Input } from "ui";

type InstituteCardProps = {
  name: string;
  value: string;
  IconComponent: Icon;
  isSelected: boolean;
  onClick: () => void;
}

function InstituteCard(props : InstituteCardProps) {
  const {IconComponent, isSelected, name, onClick, value} = props;
  const selectedStyle = "border-primary-500 text-primary-600";

  return (
    <section className="flex relative rounded-md border text-gray-600 bg-card text-card-foreground shadow p-4 mr-2 cursor-pointer">
    <section
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-5 ${isSelected ? selectedStyle : ""}`}
    >
      <div className={cn('absolute top-0 left-2 mt-2', isSelected ? 'visible' : 'invisible')}>
        <CheckCircle />
      </div>
      <div className="font-normal">{name}</div>
      <IconComponent className="h-12 w-12 font-normal" strokeWidth={1}/>
    </section>
    </section>
  );
}

export function SetupForm() {
  const [selected, setSelected] = useState("school");
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: { institute: string }) => {
    console.log(data); // Replace this with your API call
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
      <section>
        <label className="block text-gray-700">Looking for</label>
        <div className="flex py-2">
          <InstituteCard
            name="School"
            value="school"
            IconComponent={School2}
            isSelected={selected === 'school'}
            onClick={() => setSelected('school')}
          />
          <InstituteCard
            name="College"
            value="college"
            IconComponent={GraduationCap}
            isSelected={selected === 'college'}
            onClick={() => setSelected('college')}
          />
          <InstituteCard
            name="Others"
            value="others"
            IconComponent={PersonStanding}
            isSelected={selected === 'others'}
            onClick={() => setSelected('others')}
          />
        </div>
        <input type="hidden" {...register("institute")} value={selected} />
      </section>

      <div>
        <label className="block text-gray-700">{`${selected === "others" ? "Institute" : titilize(selected)}'s name`}</label>
        <Input
          type="text"
          className="mt-2"
          placeholder={`Enter name of the ${selected === "others" ? "institute" : selected}`}
          {...register('name', { required: true })}
        />
      </div>
      <div className="mt-6 w-full">
        <Button type="submit" className="w-full text-white">
          Next
        </Button>
      </div>
    </form>
  );
}
