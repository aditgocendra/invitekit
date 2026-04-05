import GridTemplate from "@/components/grid-template";

export default async function CreateInvitation() {
  return (
    <>
      <h1 className='font-bold text-xl flex flex-col'>
        Select Template
        <span className='font-normal text-sm text-secondary-foreground'>
          Select a template to get started
        </span>
      </h1>

      <GridTemplate action='create' />
    </>
  );
}
