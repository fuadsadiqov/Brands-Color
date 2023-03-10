 import { useContext, useEffect, useState } from 'react'
 import MainContext from '../MainContext'
 import {GrLink, GrDownload, GrClose} from 'react-icons/gr'
 
 export default function Download() {
   
    const {selectedBrands, brands, setSelectedBrands} = useContext(MainContext)
    const [downloadURL, setDownloadUrl] = useState()
    const [cssMethod, setCssMethod] = useState('css')
    useEffect(() =>{
            let output = ''

        if(selectedBrands.length > 0){
            
            switch (cssMethod) {
                case 'css':
                    output += ':root {\n'
                    selectedBrands.map(slug =>{
                        let brand = brands.find(brand => brand.slug === slug)
                        brand.colors.map((color, key) => {
                            output += `--${slug}-${key}: #${color}; \n`
                        })
                    })
                    output += '}'
                    break;
            
                case 'scss':
                    selectedBrands.map(slug =>{
                        let brand = brands.find(brand => brand.slug === slug)
                        brand.colors.map((color, key) => {
                            output += `\$${slug}-${key}: #${color}; \n`
                        })
                    })
                    break;
                case 'less':
                    selectedBrands.map(slug =>{
                        let brand = brands.find(brand => brand.slug === slug)
                        brand.colors.map((color, key) => {
                            output += `@${slug}-${key}: #${color}; \n`
                        })
                    })
                    break;    
            }

            const blob = new Blob([output])
            const url = URL.createObjectURL(blob)
            setDownloadUrl(url) 
            return () =>{
                URL.revokeObjectURL(url)
                setDownloadUrl('')
            }
        }
    }, [selectedBrands, cssMethod])

    const getLink = () =>{
        prompt("Here's the URL to share", `http://localhost:3000/collections/${selectedBrands.join(',')}`)
    }
    
    return (
     <div className={`download ${selectedBrands.length == 0 ? 'disabled' : 'active'}`}>
        <div className="download-icon">
            <a download={`brands.${cssMethod}`} href={downloadURL}>
                <GrDownload/>
            </a>
            <select onChange={(e) => setCssMethod(e.target.value)}>
                <option value="css">CSS</option>
                <option value="scss">SCSS</option>
                <option value="less">LESS</option>
            </select>
            <button onClick={getLink}>
                <GrLink/> 
            </button>
            <button onClick={() => setSelectedBrands([])}><GrClose/></button>
        </div>
        <div className="selected">
            {selectedBrands.length} {selectedBrands.length > 1 ? <span>brands</span> : <span>brand</span>} collacted
        </div>
     </div>
   )
 }
 