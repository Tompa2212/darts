import { render, screen, fireEvent } from '@testing-library/react';
import TeamsReorder from './teams-reorder';

describe('TeamsReorder', () => {
  const mockTeams = [
    { id: '1', name: 'Team 1', players: [{ id: '1', name: 'Player 1' }] },
    { id: '2', name: 'Team 2', players: [{ id: '2', name: 'Player 2' }] },
    { id: '3', name: 'Team 3', players: [{ id: '3', name: 'Player 3' }] }
  ];

  const mockOnReorder = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders move up/down buttons appropriately', () => {
    render(<TeamsReorder teams={mockTeams} onReorder={mockOnReorder} />);

    const editOrderButton = screen.getByRole('button', { name: 'Edit Order' });
    fireEvent.click(editOrderButton);

    const firstTeamMoveUpButton = screen.getByLabelText('Move Team 1 up');
    expect(firstTeamMoveUpButton).toBeInTheDocument();
    expect(firstTeamMoveUpButton).toBeDisabled();

    const middleTeamMoveUpButton = screen.getByLabelText('Move Team 2 up');
    expect(middleTeamMoveUpButton).toBeInTheDocument();
    expect(middleTeamMoveUpButton).not.toBeDisabled();

    const middleTeamMoveDownButton = screen.getByLabelText('Move Team 2 down');
    expect(middleTeamMoveDownButton).toBeInTheDocument();
    expect(middleTeamMoveDownButton).not.toBeDisabled();

    const lastTeamMoveDownButton = screen.getByLabelText('Move Team 3 down');
    expect(lastTeamMoveDownButton).toBeInTheDocument();
    expect(lastTeamMoveDownButton).toBeDisabled();
  });

  it('calls onReorder when moving a team up', () => {
    render(<TeamsReorder teams={mockTeams} onReorder={mockOnReorder} />);

    const editOrderButton = screen.getByRole('button', { name: 'Edit Order' });
    fireEvent.click(editOrderButton);

    const moveUpButton = screen.getByLabelText('Move Team 3 up');
    fireEvent.click(moveUpButton);

    // Check if onReorder was called with the correct reordered teams
    expect(mockOnReorder).toHaveBeenCalledTimes(1);
    expect(mockOnReorder).toHaveBeenCalledWith([mockTeams[0], mockTeams[2], mockTeams[1]]);
  });

  it('calls onReorder when moving a team down', () => {
    render(<TeamsReorder teams={mockTeams} onReorder={mockOnReorder} />);

    const editOrderButton = screen.getByRole('button', { name: 'Edit Order' });
    fireEvent.click(editOrderButton);

    const moveDownButton = screen.getByLabelText('Move Team 1 down');
    fireEvent.click(moveDownButton);

    // Check if onReorder was called with the correct reordered teams
    expect(mockOnReorder).toHaveBeenCalledTimes(1);
    expect(mockOnReorder).toHaveBeenCalledWith([mockTeams[1], mockTeams[0], mockTeams[2]]);
  });
});
