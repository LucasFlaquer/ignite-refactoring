import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodInterface {
  id: number
  name: string
  available: Boolean
  description: string
  image: string
}

export function Dashboard() {
  const [foods, setFoods] = useState<FoodInterface[]>([])
  const [editingFood, setEditingFood] = useState<FoodInterface>({} as FoodInterface)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  async function handleAddFood(food: FoodInterface) {
    try {
      const newFood: FoodInterface = { ...food, available: true }
      const response = await api.post('/foods', newFood)
      setFoods([...foods, response.data])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleUpdateFood(food: FoodInterface) {
    try {
      const response = await api.put(`/foods/${editingFood.id}`,
        { ...editingFood, ...food })
      const foodUpdated: FoodInterface = response.data
      const foodsUpdated = foods.map((food: FoodInterface) => {
        if (food.id !== foodUpdated.id)
          return food
        else return foodUpdated
      })
      setFoods(foodsUpdated)
    } catch (error) {

    }
  }
  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`)
    const foodsFiltered = foods.filter(food => food.id !== id)
    setFoods(foodsFiltered)
  }
  function toggleModal() {
    setModalOpen(!modalOpen)
  }
  function toggleEditModal() {
    setEditModalOpen(!editModalOpen)
  }
  function handleEditFood(food: FoodInterface) {
    setEditingFood(food)
    setEditModalOpen(true)
  }


  useEffect(() => {
    api.get('/foods')
      .then(response => {
        setFoods(response.data)
      })
  }, [])

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
  )
}