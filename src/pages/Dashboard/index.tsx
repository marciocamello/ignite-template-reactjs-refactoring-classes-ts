import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export function Dashboard() {

    const [foods, setFoods] = useState<Food[]>([]);
    const [editingFood, setEditingFood] = useState<Food>();
    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    async function loadFoods() {
        const response = await api.get('/foods');

        setFoods(response.data);
    }

    useEffect(() => {

        loadFoods();
    }, []);


    async function handleAddFood(food: Food) {

        try {
            const response = await api.post('/foods', {
                ...food,
                available: true,
            });

            setFoods(state => [...state, response.data]);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleUpdateFood(food: Food) {

        try {
            const foodUpdated = await api.put(
                `/foods/${editingFood?.id}`,
                { ...editingFood, ...food },
            );

            const foodsUpdated = foods.map(f =>
                f.id !== foodUpdated.data.id ? f : foodUpdated.data,
            );

            setFoods(foodsUpdated);
        } catch (err) {
            console.log(err);
        }
    }

    async function handleDeleteFood(id: number) {

        try {
            await api.delete(`/foods/${id}`);

            const foodsFiltered = foods.filter(food => food.id !== id);

            setFoods(foodsFiltered);
        } catch (err) {
            console.log(err);
        }
    }

    function toggleModal() {

        setModalOpen(!modalOpen);
    }

    function toggleEditModal() {

        setEditModalOpen(!editModalOpen);
    }

    function handleEditFood(food: Food) {

        setEditingFood(food);
        toggleEditModal();
    }

    return (
        <>
            <Header openModal={toggleModal} />
            <ModalAddFood
                isOpen={modalOpen}
                setIsOpen={toggleModal}
                handleAddFood={handleAddFood}
            />
            <ModalEditFood
                isOpen={editModalOpen}
                setIsOpen={toggleEditModal}
                editingFood={editingFood}
                handleUpdateFood={handleUpdateFood}
            />

            <FoodsContainer data-testid="foods-list">
                {foods &&
                    foods.map(food => (
                        <Food
                            key={food.id}
                            food={food}
                            handleDelete={handleDeleteFood}
                            handleEditFood={handleEditFood}
                        />
                    ))}
            </FoodsContainer>
        </>
    );
}


export default Dashboard;
