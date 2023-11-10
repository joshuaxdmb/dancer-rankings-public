import React from 'react'

type Props = {}

const SignUpForm = (props: Props) => {
  return (
    <form
            onSubmit={(e) => {
              e.preventDefault;
            }}
            className="space-y-4 mb-8"
          >
            {authOption !== 'login' && (
              <>
                <label
                  htmlFor="name"
                  className="text-left block text-sm font-medium text-gray-200"
                >
                  How should we call you?:
                </label>
                <input
                  type="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full p-2 border rounded"
                />
                <label
                  htmlFor="dancerole"
                  className="text-left block text-sm font-medium text-gray-200"
                >
                  Your primary dancing role:
                </label>
                <select
                  id="dancerole"
                  name="dancerole"
                  className="w-full p-2 border rounded"
                  value={danceRole}
                  onChange={(e) => {
                    setDancerole(e.target.value as DanceRolesEnum);
                  }}
                >
                  {Object.keys(DanceRolesEnum).map((dr) => (
                    <option key={dr} value={dr}>
                      {DanceRoleLabels[dr as DanceRolesEnum]}
                    </option>
                  ))}
                </select>
                <label
                  htmlFor="dancelevel"
                  className="text-left block text-sm font-medium text-gray-200"
                >
                  Your dancer level (assigned by teachers):
                </label>
                <select
                  id="dancelevel"
                  name="dancelevel"
                  className="w-full p-2 border rounded text-gray-400"
                  value={danceLevel}
                  onChange={(e) => {
                    {
                    }
                  }}
                >
                  {[
                    <option className="text-gray-400" key={danceLevel}>
                      {DanceLevelLabels[danceLevel]}
                    </option>,
                  ]}
                </select>
                <label
                  htmlFor="dancelevel"
                  className="text-left block text-sm font-medium text-gray-200"
                >
                  Your gender:
                </label>
                <select
                  id="gender"
                  name="gender"
                  className="w-full p-2 border rounded"
                  value={gender}
                  onChange={(e) => {
                    {
                      setGender(e.target.value as GendersEnum);
                    }
                  }}
                  //Note: genders values are the same as keys
                >
                  {Object.values(GendersEnum).map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </>
            )}
            <label
              htmlFor="email"
              className="text-left block text-sm font-medium text-gray-200"
            >
              Your email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <label
              htmlFor="password"
              className="text-left block text-sm font-medium text-gray-200"
            >
              Choose a password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
            <label
              htmlFor="location"
              className="text-left block text-sm font-medium text-gray-200"
            >
              Your community:
            </label>
            <select
              id="location"
              name="location"
              className="w-full p-2 border rounded mt-1"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value as LocationIdsEnum);
              }}
            >
              {Locations.filter(l => l.id !== LocationIdsEnum.global).map((location, index) => (
                <option key={index} value={location.id}>
                  {location.label}
                </option>
              ))}
            </select>
          </form>
  )
}

export default SignUpForm