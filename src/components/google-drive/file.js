import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

export default function File({file}) {
  return (
    <a href={file.url} target="_blank" className='w-full px-2 py-1 bg-gray-100 rounded-lg border-2 border-black hover:bg-gray-300'>
        <FontAwesomeIcon icon={faFile} className="mr-2" />
        {file.name}
    </a>
  )
}
