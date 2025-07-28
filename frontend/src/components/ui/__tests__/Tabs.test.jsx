import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../Tabs';

it('switches content when trigger clicked', async () => {
  render(
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First</TabsContent>
      <TabsContent value="two">Second</TabsContent>
    </Tabs>
  );

  expect(screen.getByText('First')).toBeInTheDocument();
  expect(screen.queryByText('Second')).not.toBeInTheDocument();

  await userEvent.click(screen.getByText('Two'));

  expect(screen.getByText('Second')).toBeInTheDocument();
});
