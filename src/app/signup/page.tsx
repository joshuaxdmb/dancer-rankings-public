/*
This is the home component of the application
*/
'use client'
import { useUser } from '@/hooks/useUser'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { showSideBarAtom } from '@/atoms/layoutAtom'
import MultipleChoiceButton from './components/MultipleChoiceButton'
import Title from './components/Title'
import { stages, stagesEnum, indices, Stage } from './content'
import StyledButton from '@/app/components/global/SytledButton'
import { getMarginTop } from '@/app/components/layout/StatusBarSpacing'
import { deviceDimensionsAtom } from '@/atoms/deviceDimensionsAtom'
import { HiMiniChevronLeft, HiMiniChevronRight, HiMiniXMark } from 'react-icons/hi2'
import { useRouter } from 'next/navigation'
import { usePersistentRecoilState } from '@/hooks/usePersistentState'
import { signUpFormAtom, rejectedSignUpAtom } from '@/atoms/signupFormAtom'
import SwipeableViews from 'react-swipeable-views-react-18-fix'
import BirthdayInputField from '../account/components/BirthDayInput'
import { useSupabase } from '@/hooks/useSupabase'

export default function Home() {
  const router = useRouter()
  const { userDetails } = useUser()
  const [showSidebar, setShowSidebar] = useRecoilState(showSideBarAtom)
  const [marginTop, setMarginTop] = useState(20)
  const [deviceDimensions] = useRecoilState(deviceDimensionsAtom)
  const [index, setIndex] = useState(0)
  const [stage, setStage] = useState(stagesEnum.identification)
  const [signUpForm, setSignUpForm, persistentSignUpForm, setPersistentSignUpForm] =
    usePersistentRecoilState(signUpFormAtom)
  const [rejectedSignUp, setRejectedSignUp] = useRecoilState(rejectedSignUpAtom)
  const [birthdate, setBirthdate] = useState<string>('')
  const supabase = useSupabase()
  const [wrongBirthdate, setWrongBirthdate] = useState(false)

  const setStatusBarHeight = async () => {
    const margin = await getMarginTop(16, deviceDimensions?.statusBarHeight)
    setMarginTop(margin)
  }

  const onChangeIndex = (newIndex: number) => {
    if (newIndex > index) nextState()
    else prevState()
  }

  const saveLocally = async (rej = false) => {
    let updatedForm =
    birthdate && !wrongBirthdate
      ? {
          ...signUpForm,
          [stagesEnum.birthday]: birthdate,
        }
      : signUpForm

    await setPersistentSignUpForm(updatedForm)
    setSignUpForm(updatedForm)
  }

  const saveToDataBase = async () => {
    let updatedForm =
      birthdate && !wrongBirthdate
        ? {
            ...signUpForm,
            [stagesEnum.birthday]: birthdate,
          }
        : signUpForm

    await supabase.updateUser(userDetails.id, updatedForm)
  }

  const setNewInedx = (newIndex: number) => {
    setStage(indices[newIndex])
    setIndex(newIndex)
  }

  const prevState = () => {
    switch (index) {
      case 3:
        setNewInedx(2)
        break
      case 2:
        if (signUpForm[stagesEnum.identification] !== 'dancer') setNewInedx(1)
        else setNewInedx(0)
        break
      case 1:
        setNewInedx(0)
        break
    }
  }

  const nextState = () => {
    switch (index) {
      case 0:
        if (signUpForm[stagesEnum.identification] !== 'dancer') setNewInedx(1)
        else setNewInedx(2)
        break
      case 1:
        setNewInedx(2)
        break
      case 2:
        setNewInedx(3)
        break
    }
  }

  const updateSignUpForm = async (stage: string, answer: string) => {
    setSignUpForm({
      ...signUpForm,
      [stage]: answer,
    })
    console.log(signUpForm[stage], signUpForm)
  }

  const onSelect = async (result: any) => {
    stage && updateSignUpForm(stage, result)
  }

  const closeModal = async () => {
    setRejectedSignUp(true)
    await saveLocally(true)
    await saveToDataBase()
    router.push('/')
  }

  useEffect(() => {
    setShowSidebar(false)
    setStatusBarHeight()
  }, [])

  return (
    <div
      className='
        h-screen
        flex
        w-screen
        items-center
        px-10
        justify-center'>
      <button
        className={`p-6 pt-2 pb-0 z-30 absolute top-0 left-0 cursor-pointer hover:opacity-50`}
        style={{ marginTop }}
        onClick={closeModal}>
        <HiMiniXMark className='text-white' size={35} />
      </button>
      <button
        onClick={prevState}
        className='left-2 md:left-10 cursor-pointer opacity-20 hover:opacity-80 h-10 absolute'>
        <HiMiniChevronLeft className='text-white' size={35} />
      </button>
      <button
        onClick={nextState}
        className='right-2 md:right-10 cursor-pointer opacity-20 hover:opacity-80 h-10 absolute'>
        <HiMiniChevronRight className='text-white' size={35} />
      </button>
      <SwipeableViews
        enableMouseEvents={true}
        animateTransitions={true}
        slideStyle={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        index={index}
        onChangeIndex={onChangeIndex}>
        {Object.keys(stages).map((stage: string, index: number) => {
          const s = stages[stage as stagesEnum] as Stage
          return (
            <div key={index} className='max-w-[350px] md:w-[260px] gap-12 flex flex-col'>
              <Title titleContent={s.title} />
              <div className='gap-4 flex flex-col items-center justify-center'>
                {s.options?.map((o: any, index) => (
                  <MultipleChoiceButton
                    image={o.image}
                    selected={signUpForm[stage] === o.result}
                    onClick={() => onSelect(o.result)}
                    key={index}
                    title={o.title}
                  />
                ))}
                {stage === stagesEnum.birthday && (
                  <BirthdayInputField
                    className='items-center text-center justify-center'
                    birthdate={birthdate}
                    setBirthdate={setBirthdate}
                    setWrongBirthdate={setWrongBirthdate}
                  />
                )}
              </div>
              {index === indices.length - 1 ? (
                <StyledButton onClick={closeModal}>Done!</StyledButton>
              ) : (
                <StyledButton onClick={nextState}>Next</StyledButton>
              )}
            </div>
          )
        })}
      </SwipeableViews>
    </div>
  )
}
