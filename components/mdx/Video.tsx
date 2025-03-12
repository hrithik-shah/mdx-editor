import { AspectRatio } from "../ui/aspect-ratio"

export const MdxVideo = ({src}: {src: string}) => {
    return (
        <div className='w-full h-full flex justify-center max-h-[675px] mb-8'>
            <div className='w-full h-full max-w-[1200px]'>
                <AspectRatio ratio={16/9} className="">
                    <iframe
                    src={src}
                    className='w-full h-full'
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    ></iframe>
                </AspectRatio>
            </div>
        </div>


    )
}